import { define } from "../../utils.ts";

interface ExerciseContent {
  title: string;
  content: string;
  exercises: string[];
}

export const handler = define.handlers({
  async GET(ctx) {
    const url = ctx.url.searchParams.get('url');
    if (!url) return new Response("Missing URL", { status: 400 });
    
    try {
      const response = await fetch(url);
      const html = await response.text();
      
      // Extract exercise content (simplified parsing)
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : 'Matematična naloga';
      
      // Extract text content, removing HTML tags but preserving structure
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Split into potential exercises - look for exercises by splitting on "Rešitev:"
      const exercises: string[] = [];
      
      // First try: split by "Rešitev:" to get individual exercises
      const parts = textContent.split(/Rešitev\s*:/);
      for (let i = 0; i < parts.length - 1; i++) {
        const exercise = parts[i].trim();
        if (exercise.length > 50 && exercise.length < 800) {
          exercises.push(exercise);
        }
      }
      
      // If no exercises found with "Rešitev:", try other patterns
      if (exercises.length === 0) {
        const exercisePatterns = [
          /Izračunaj[^]*?(?=Rešitev|Izračunaj|$)/gi,
          /Reši[^]*?(?=Rešitev|Reši|$)/gi,
          /Poenostavi[^]*?(?=Rešitev|Poenostavi|$)/gi,
          /Razčleni[^]*?(?=Rešitev|Razčleni|$)/gi,
          /Razcepi[^]*?(?=Rešitev|Razcepi|$)/gi,
          /Ugotovi[^]*?(?=Rešitev|Ugotovi|$)/gi,
          /Zapiši[^]*?(?=Rešitev|Zapiši|$)/gi
        ];
        
        for (const pattern of exercisePatterns) {
          let match;
          while ((match = pattern.exec(textContent)) !== null) {
            const exercise = match[0].trim();
            if (exercise.length > 50 && exercise.length < 500) {
              exercises.push(exercise);
            }
          }
        }
      }
      
      const result: ExerciseContent = {
        title,
        content: textContent.substring(0, 1000), // First 1000 chars
        exercises
      };
      
      return new Response(JSON.stringify(result), {
        headers: { "content-type": "application/json" }
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  },
});
