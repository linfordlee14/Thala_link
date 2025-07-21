// Since we are loading these from a CDN, we declare them for TypeScript's global scope.
// The actual objects will be on the `window` object at runtime.
declare global {
  interface Window {
      docx: any;
      PptxGenJS: any;
  }
}

import type { DocumentContent, SlideContent } from '../types';

// A map to keep track of script loading promises, ensuring we don't load a script multiple times.
const scriptLoadingPromises = new Map<string, Promise<void>>();

/**
 * Dynamically loads a script from a URL and resolves when its corresponding global variable is available.
 * This function is idempotent; it will only attempt to load a given script URL once.
 * @param {string} scriptUrl - The URL of the script to load.
 * @param {string} globalVarName - The name of the global variable the script is expected to create on the `window` object.
 * @returns {Promise<void>} A promise that resolves when the library is loaded and ready, or rejects on failure.
 */
const loadExternalLibrary = (scriptUrl: string, globalVarName: string): Promise<void> => {
    // If the library is already loaded, resolve immediately.
    if ((window as any)[globalVarName]) {
        return Promise.resolve();
    }
    
    // If we are already in the process of loading this script, return the existing promise.
    if (scriptLoadingPromises.has(scriptUrl)) {
        return scriptLoadingPromises.get(scriptUrl)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.crossOrigin = 'anonymous';

        script.onload = () => {
            // Check if the global variable is now available.
            if ((window as any)[globalVarName]) {
                resolve();
            } else {
                reject(new Error(`Script from ${scriptUrl} loaded, but global variable '${globalVarName}' was not found.`));
            }
        };

        script.onerror = () => {
            reject(new Error(`Failed to load script from URL: ${scriptUrl}`));
        };

        document.head.appendChild(script);
    });

    // Store the promise to prevent re-loading
    scriptLoadingPromises.set(scriptUrl, promise);
    return promise;
};


// Helper to trigger browser download for a blob
const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Generates a .docx file from the document content and triggers a download.
 * @param {DocumentContent} content - The document content object.
 */
export const generateDocx = async (content: DocumentContent) => {
  try {
    await loadExternalLibrary('https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js', 'docx');
  } catch (error) {
    console.error("docx.js library failed to load.", error);
    alert("Error: The document generation library (docx.js) could not be loaded. Please check your internet connection and try again.");
    return;
  }
  
  const { Packer, Document, Paragraph, TextRun, HeadingLevel, AlignmentType } = window.docx;

  const children = [
    new Paragraph({
      text: content.title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: '' }), // spacing
    new Paragraph({
      children: [
        new TextRun({ text: 'Executive Summary', bold: true, size: 28 }), // 14pt
      ],
      style: "summaryHeading",
    }),
    new Paragraph({
      text: content.executiveSummary,
      style: 'normalPara',
    }),
    new Paragraph({ text: '' }), // spacing
  ];

  content.sections.forEach(section => {
    children.push(
      new Paragraph({
        text: section.heading,
        heading: HeadingLevel.HEADING_2,
        style: 'sectionHeading'
      })
    );
    section.content.forEach(part => {
      if (part.type === 'paragraph') {
        children.push(new Paragraph({ text: part.text, style: 'normalPara' }));
      } else if (part.type === 'bullet') {
        children.push(new Paragraph({
          text: part.text,
          bullet: { level: 0 },
          style: 'normalPara'
        }));
      }
    });
    children.push(new Paragraph({ text: '' })); // spacing after section
  });

  const doc = new Document({
    styles: {
      paragraphStyles: [
        { id: "sectionHeading", name: "Section Heading", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 26, bold: true, color: "2E74B5" }, paragraph: { spacing: { before: 240, after: 120 } } },
        { id: "summaryHeading", name: "Summary Heading", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 24, bold: true, color: "3F86C7" }, paragraph: { spacing: { after: 120 } } },
        { id: "normalPara", name: "Normal Para", basedOn: "Normal", next: "Normal", quickFormat: true, run: { size: 22 }, paragraph: { spacing: { after: 100 } } },
      ],
    },
    sections: [{
      children: children,
    }],
  });
  
  const blob = await Packer.toBlob(doc);
  const safeTitle = content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  saveBlob(blob, `${safeTitle}_proposal.docx`);
};

/**
 * Generates a .pptx file from the slide content and triggers a download.
 * @param {SlideContent[]} content - An array of slide content objects.
 */
export const generatePptx = async (content: SlideContent[]) => {
  try {
    await loadExternalLibrary('https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js', 'PptxGenJS');
  } catch (error) {
    console.error("PptxGenJS library failed to load.", error);
    alert("Error: The presentation generation library (PptxGenJS) could not be loaded. Please check your internet connection and try again.");
    return;
  }

  const pptx = new window.PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  content.forEach((slideData, index) => {
    const slide = pptx.addSlide();

    if (slideData.visualSuggestion) {
      slide.addNotes(`Visual Suggestion: ${slideData.visualSuggestion}`);
    }

    if(index === 0) { // Title slide
      slide.background = { color: '003366' };
      slide.addText(slideData.title, { 
        x: 0.5, y: 1.5, w: '90%', h: 1, 
        fontSize: 44, bold: true, color: 'FFFFFF', align: 'center'
      });
      if(slideData.points.length > 0) {
        slide.addText(slideData.points[0], { 
          x: 0.5, y: 2.75, w: '90%', h: 1, 
          fontSize: 24, color: 'F1F1F1', align: 'center'
        });
      }
    } else { // Content slides
      slide.background = { color: 'F1F1F1' };
      slide.addText(slideData.title, { 
        x: 0.5, y: 0.25, w: '90%', h: 1, 
        fontSize: 32, bold: true, color: '003366' 
      });
      slide.addText(slideData.points.join('\\n'), {
        x: 0.5, y: 1.5, w: '90%', h: 3.5,
        fontSize: 20, color: '343434', bullet: { type: 'bullet' },
      });
    }
  });
  const safeTitle = content.length > 0 ? content[0].title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'presentation';
  await pptx.writeFile({ fileName: `${safeTitle}.pptx` });
};