import { define } from "../../utils.ts";
import { parseHtmlExercises } from "../../utils/simple-parser.ts";

export const handler = define.handlers({
  async GET(ctx) {
    try {
      // Read the HTML file
      const htmlContent = await Deno.readTextFile("./static/Izjave in množice.html");
      
      // Parse exercises from HTML
      const exercises = parseHtmlExercises(htmlContent);
      
      return new Response(JSON.stringify(exercises), {
        headers: { "content-type": "application/json" }
      });
    } catch (error) {
      console.error('Error parsing HTML exercises:', error);
      return new Response(JSON.stringify([]), {
        headers: { "content-type": "application/json" }
      });
    }
  },
});
