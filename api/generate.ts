
import { GoogleGenAI, Type } from "@google/genai";
// Vercel automatically makes environment variables available here
const apiKey = process.env.API_KEY;

if (!apiKey) {
    // This will be caught by Vercel's logs
    console.error("API_KEY environment variable not set");
    // Don't throw the error to the client, just log it.
    // The response below will inform the user.
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

// --- Schemas defined here for encapsulation ---
const docSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The main title of the document." },
        executiveSummary: { type: Type.STRING, description: "A brief, one-paragraph summary of the entire project." },
        sections: {
            type: Type.ARRAY,
            description: "An array of sections that make up the document body.",
            items: {
                type: Type.OBJECT,
                properties: {
                    heading: { type: Type.STRING, description: "The heading for this section." },
                    content: {
                        type: Type.ARRAY,
                        description: "An array of content parts, which can be paragraphs or bullet points.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, enum: ["paragraph", "bullet"], description: "The type of content." },
                                text: { type: Type.STRING, description: "The text content." },
                            },
                            required: ["type", "text"],
                        },
                    },
                },
                required: ["heading", "content"],
            },
        },
    },
    required: ["title", "executiveSummary", "sections"],
};

const slidesSchema = {
    type: Type.ARRAY,
    description: "An array of slide objects for a presentation.",
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: "The title of the slide." },
            points: { type: Type.ARRAY, description: "A list of brief, impactful bullet points.", items: { type: Type.STRING } },
            visualSuggestion: { type: Type.STRING, description: "Optional. A brief suggestion for a visual element for this slide." }
        },
        required: ["title", "points"],
    }
};

// --- Handler for Vercel Serverless Function ---
export default async function handler(request: Request) {
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "Server is not configured. Missing API Key." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { projectBrief, generationType } = await request.json();

        if (!projectBrief || !generationType) {
            return new Response(JSON.stringify({ error: 'Missing projectBrief or generationType' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        let prompt;
        let schema;
        
        if (generationType === 'doc') {
            prompt = `You are an expert project manager and technical writer. Transform the following project brief into a well-structured project proposal document, adhering strictly to the provided JSON schema.\n\nProject Brief:\n---\n${projectBrief}\n---`;
            schema = docSchema;
        } else if (generationType === 'slides') {
            prompt = `You are an expert presentation designer. Convert the following project brief into a concise 10-slide pitch deck based on the required structure. Output a JSON array following the schema. For each slide, provide a title, brief bullet points, and an optional visual suggestion.\n\n**Required Pitch Deck Structure:**\n1. Title Slide\n2. Problem Overview\n3. Our Solution\n4. How It Works\n5. Technology Stack\n6. Features by User\n7. Impact\n8. Challenges & Mitigation\n9. Roadmap / Timeline\n10. Team & Call to Action\n\n**Project Brief:**\n---\n${projectBrief}\n---`;
            schema = slidesSchema;
        } else {
             return new Response(JSON.stringify({ error: 'Invalid generationType' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonString = response.text.trim();
        const parsedJson = JSON.parse(jsonString);

        return new Response(JSON.stringify(parsedJson), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Error in serverless function:', error);
        return new Response(JSON.stringify({ error: 'An internal error occurred while generating content.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}