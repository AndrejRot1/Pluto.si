import { define } from "../../utils.ts";
import { izjaveInMnoziceExercises } from "../../data/exercises.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const topic = ctx.url.searchParams.get('topic');
    
    if (topic === 'izjave-in-mnozice') {
      return new Response(JSON.stringify(izjaveInMnoziceExercises), {
        headers: { "content-type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify([]), {
      headers: { "content-type": "application/json" }
    });
  },
});
