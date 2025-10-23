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

      console.log(`Processing image: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

      // Use OCR.space free API - send file directly
      const ocrFormData = new FormData();
      ocrFormData.append("file", file);
      ocrFormData.append("language", "eng");
      ocrFormData.append("isOverlayRequired", "false");
      ocrFormData.append("detectOrientation", "true");
      ocrFormData.append("scale", "true");
      ocrFormData.append("OCREngine", "2"); // Engine 2 is better for math

      console.log("Sending request to OCR.space API...");

      const ocrResponse = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        headers: {
          "apikey": "K87899142388957", // Free API key
        },
        body: ocrFormData,
      });

      console.log("OCR API response status:", ocrResponse.status);

      if (!ocrResponse.ok) {
        const errorText = await ocrResponse.text();
        console.error("OCR API error response:", errorText);
        throw new Error(`OCR API error: ${ocrResponse.statusText} - ${errorText}`);
      }

      const ocrResult = await ocrResponse.json();
      console.log("OCR API result:", JSON.stringify(ocrResult, null, 2));

      if (ocrResult.IsErroredOnProcessing) {
        const errorMsg = ocrResult.ErrorMessage?.[0] || "OCR processing failed";
        console.error("OCR processing error:", errorMsg);
        throw new Error(errorMsg);
      }

      const text = ocrResult.ParsedResults?.[0]?.ParsedText || "";

      console.log("Extracted text length:", text.length);
      console.log("Extracted text preview:", text.substring(0, 100));

      // If no text extracted, return empty but don't fail
      if (!text || text.trim().length === 0) {
        console.warn("No text extracted from image, returning empty text");
      }

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

