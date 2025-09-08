 export interface IAdData {
  id: string;
  title: string;
  description: string;
  duration: number;
  image: string;
  link: string;
}

export const enum PreloadPageStatus {
    Init = 'init',
    Ading = 'ading',
    Loading = 'loading',
    End = 'end',
}
