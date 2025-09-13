
export type AspectRatio = "9:16" | "1:1" | "16:9" | "3:4" | "4:3";

export interface Poster {
  id: string;
  imageData: string;
}

export interface ImageFile {
  name: string;
  base64: string;
  mimeType: string;
}
