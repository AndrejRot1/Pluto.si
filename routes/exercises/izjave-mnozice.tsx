import { define } from "../../utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    try {
      // Read the HTML file
      const htmlContent = await Deno.readTextFile("./static/Izjave in množice.html");
      
      // Return the HTML content directly
      return new Response(htmlContent, {
        headers: { 
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-cache"
        }
      });
    } catch (error) {
      console.error('Error reading HTML file:', error);
      return new Response('Error loading exercises', { status: 500 });
    }
  },
});
