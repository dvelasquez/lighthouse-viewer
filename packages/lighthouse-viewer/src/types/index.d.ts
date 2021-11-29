declare module '*.html' {
  const value: string;
  export default value;
}

declare module '*.css' {
  const value: string;
  export default value;
}

declare module 'lighthouse-viewer' {
  export function renderReport(json: any): HTMLElement;
}
