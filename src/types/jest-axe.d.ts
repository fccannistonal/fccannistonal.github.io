declare module 'jest-axe' {
  export function axe(
    node: HTMLElement | Document | Array<HTMLElement> | Array<Document>
  ): Promise<any>;
}
