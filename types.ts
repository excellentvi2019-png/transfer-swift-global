
export enum Tool {
  IMAGE_EDIT = 'IMAGE_EDIT',
  IMAGE_GEN = 'IMAGE_GEN',
  QUICK_CHAT = 'QUICK_CHAT',
  LOCAL_EXPLORER = 'LOCAL_EXPLORER',
  COMPLEX_ANALYSIS = 'COMPLEX_ANALYSIS',
}

export interface GroundingSource {
    uri: string;
    title: string;
}
