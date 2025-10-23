import { define } from "../../utils.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const formData = await ctx.req.formData();
      const file = formData.get("image");
      const language = formData.get("language") || "sl";

      if (!file || !(file instanceof File)) {
        return new Response(
          JSON.stringify({ error: "No image file provided" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log(`Processing image: ${file.name}, size: ${file.size} bytes`);

      // Convert to base64
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      // Use OCR.space free API
      const ocrFormData = new FormData();
      ocrFormData.append("base64Image", `data:${file.type};base64,${base64}`);
      ocrFormData.append("language", "eng");
      ocrFormData.append("isOverlayRequired", "false");
      ocrFormData.append("detectOrientation", "true");
      ocrFormData.append("scale", "true");
      ocrFormData.append("OCREngine", "2"); // Engine 2 is better for math

      const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        headers: {
          "apikey": "K87899142388957", // Free API key
        },
        body: ocrFormData,
      });

      if (!ocrResponse.ok) {
        throw new Error(`OCR API error: ${ocrResponse.statusText}`);
      }

      const ocrResult = await ocrResponse.json();

      if (ocrResult.IsErroredOnProcessing) {
        throw new Error(ocrResult.ErrorMessage?.[0] || "OCR processing failed");
      }

      const text = ocrResult.ParsedResults?.[0]?.ParsedText || "";

      console.log("Extracted text:", text);

      // Return extracted text
      return new Response(
        JSON.stringify({ 
          text: text.trim(),
          fileName: file.name 
        }),
        { 
          status: 200, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    } catch (error) {
      console.error("OCR error:", error);
      return new Response(
        JSON.stringify({ 
          error: "Failed to process image",
          details: error instanceof Error ? error.message : String(error)
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  },
});

