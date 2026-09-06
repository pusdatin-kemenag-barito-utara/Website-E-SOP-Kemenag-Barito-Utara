import { PDFDocument, PDFRawStream, PDFName, PDFNumber, PDFRef } from "pdf-lib";

export type CompressionLevel = "low" | "medium" | "high";

export interface PdfInfo {
  size: number;
  pageCount?: number;
}

export class PDFService {
  /**
   * Compresses a PDF file focusing on speed and minimal visual changes.
   */
  async compressPdf(
    file: File,
    level: CompressionLevel = "medium",
  ): Promise<Blob> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // 1. Metadata Stripping (Always fast)
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");

      // 2. Optimized Image Processing
      const indirectObjects = pdfDoc.context.enumerateIndirectObjects();
      const imageTargets: { ref: PDFRef; stream: PDFRawStream }[] = [];

      for (const [ref, pdfObject] of indirectObjects) {
        if (pdfObject instanceof PDFRawStream) {
          const dict = pdfObject.dict;
          if (dict.get(PDFName.of("Subtype")) === PDFName.of("Image")) {
            // Only process images larger than 150KB to save time
            // Smaller images don't contribute much to total size but take time to process
            if (pdfObject.contents.length > 150 * 1024) {
              imageTargets.push({ ref, stream: pdfObject });
            }
          }
        }
      }

      console.log(`Found ${imageTargets.length} large images to optimize.`);

      // Process in batches of 4 to keep the browser responsive
      const batchSize = 4;
      for (let i = 0; i < imageTargets.length; i += batchSize) {
        const batch = imageTargets.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async (target) => {
            try {
              const compressedData = await this.processImageStream(
                target.stream,
                level,
              );
              if (compressedData) {
                const dict = target.stream.dict;
                dict.set(
                  PDFName.of("Length"),
                  pdfDoc.context.obj(compressedData.length),
                );
                dict.set(PDFName.of("Filter"), PDFName.of("DCTDecode"));
                dict.delete(PDFName.of("DecodeParms"));

                const newStream = PDFRawStream.of(dict, compressedData);
                pdfDoc.context.assign(target.ref, newStream);
              }
            } catch {
              // Silent fail for individual images to keep process moving
            }
          }),
        );
      }

      // 3. Final structural optimization
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false,
      });

      return new Blob([compressedBytes as BlobPart], {
        type: "application/pdf",
      });
    } catch (error) {
      console.error("Error compressing PDF:", error);
      throw new Error("Gagal mengompres PDF. Pastikan file valid.");
    }
  }

  private async processImageStream(
    stream: PDFRawStream,
    level: CompressionLevel,
  ): Promise<Uint8Array | null> {
    const { dict } = stream;
    const widthObj = dict.get(PDFName.of("Width"));
    const heightObj = dict.get(PDFName.of("Height"));

    if (!(widthObj instanceof PDFNumber) || !(heightObj instanceof PDFNumber))
      return null;

    const w = widthObj.asNumber();
    const h = heightObj.asNumber();

    let bytes = stream.contents;
    const filter = dict.get(PDFName.of("Filter"));

    // Decompress if needed
    if (filter === PDFName.of("FlateDecode")) {
      try {
        const ds = new DecompressionStream("deflate");
        const writer = ds.writable.getWriter();
        await writer.write(bytes as unknown as BufferSource);
        await writer.close();
        const response = new Response(ds.readable);
        bytes = new Uint8Array(await response.arrayBuffer());
      } catch {
        return null;
      }
    }

    const blob = new Blob([bytes as BlobPart]);
    const imageUrl = URL.createObjectURL(blob);

    try {
      const img = await this.loadImage(imageUrl);
      URL.revokeObjectURL(imageUrl);

      // Determine quality ONLY (No scaling to keep original form)
      let quality = 0.75;
      if (level === "high") quality = 0.5;
      else if (level === "medium") quality = 0.7;
      else quality = 0.85;

      const compressedBytes = await this.compressImageWithCanvas(
        img,
        w,
        h,
        quality,
      );

      // Only return if smaller
      if (compressedBytes.length < stream.contents.length) {
        return compressedBytes;
      }
      return null;
    } catch {
      URL.revokeObjectURL(imageUrl);
      return null;
    }
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  private compressImageWithCanvas(
    img: HTMLImageElement,
    w: number,
    h: number,
    quality: number,
  ): Promise<Uint8Array> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(new Uint8Array());

      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          if (!blob) return resolve(new Uint8Array());
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve(new Uint8Array(reader.result as ArrayBuffer));
          reader.readAsArrayBuffer(blob);
        },
        "image/jpeg",
        quality,
      );
    });
  }

  async getPdfInfo(file: File | Blob): Promise<PdfInfo> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      });
      return { size: file.size, pageCount: pdfDoc.getPageCount() };
    } catch {
      return { size: file.size };
    }
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  calculateSavings(original: number, compressed: number): number {
    if (original === 0) return 0;
    return Math.max(0, Math.round(((original - compressed) / original) * 100));
  }
}

export const pdfService = new PDFService();
