
export type SearchType = 'text' | 'image';

export interface SearchRequest {
  query: string;
  type: SearchType;
  sites: string[];
  file?: File;
}
