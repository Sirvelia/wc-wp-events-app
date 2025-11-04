export interface Media {
  id: number;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    file: string;
    filesize: number;
    sizes: {
      medium?: MediaSize;
      large?: MediaSize;
      thumbnail?: MediaSize;
      medium_large?: MediaSize;
      wccsp_image_medium_rectangle?: MediaSize;
      "post-thumbnail"?: MediaSize;
      "wccentral-thumbnail-small"?: MediaSize;
      "wccentral-thumbnail-large"?: MediaSize;
      "wccentral-thumbnail-past"?: MediaSize;
      "wccentral-thumbnail-hero"?: MediaSize;
      full?: MediaSize;
    };
  };
}
export interface MediaSize {
  file: string;
  width: number;
  height: number;
  filesize?: number;
  mime_type: string;
  source_url: string;
}
