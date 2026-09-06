declare module "dom-to-image-more" {
  interface Options {
    filter?: (node: Node) => boolean;
    bgcolor?: string;
    width?: number;
    height?: number;
    style?: Partial<CSSStyleDeclaration>;
    quality?: number;
    imagePlaceholder?: string;
    cacheBust?: boolean;
  }

  const domtoimage: {
    toSvg: (el: HTMLElement, options?: Options) => Promise<string>;
    toPng: (el: HTMLElement, options?: Options) => Promise<string>;
    toJpeg: (el: HTMLElement, options?: Options) => Promise<string>;
    toBlob: (el: HTMLElement, options?: Options) => Promise<Blob>;
    toPixelData: (
      el: HTMLElement,
      options?: Options,
    ) => Promise<Uint8ClampedArray>;
  };

  export default domtoimage;
}
