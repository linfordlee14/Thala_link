export interface ContentPart {
  type: 'paragraph' | 'bullet';
  text: string;
}

export interface DocumentSection {
  heading: string;
  content: ContentPart[];
}

export interface DocumentContent {
  title: string;
  executiveSummary: string;
  sections: DocumentSection[];
}

export interface SlideContent {
  title: string;
  points: string[];
  visualSuggestion?: string;
}

export enum ViewType {
  NONE,
  DOC,
  SLIDES,
}