import { define } from "../../utils.ts";

interface Exercise {
  id: string;
  title: string;
  year: string;
  topic: string;
  content: string;
  source: string;
}

// Cache for scraped exercises (in production, use Redis or DB)
let exerciseCache: Exercise[] | null = null;
let lastScrape = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function scrapeExercises(): Promise<Exercise[]> {
  const now = Date.now();
  if (exerciseCache && (now - lastScrape) < CACHE_DURATION) {
    return exerciseCache;
  }

  try {
    const response = await fetch("https://www2.arnes.si/~mpavle1/naloge/");
    const html = await response.text();
    
    const exercises: Exercise[] = [];
    
    // Parse HTML to extract exercise links and titles
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]+)<\/a>/gi;
    let match;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const [, href, title] = match;
      
      // Filter for exercise links (skip navigation, etc.)
      if (href.includes('.html') && title.trim() && 
          !title.includes('DOMAČA STRAN') && 
          !title.includes('MATEMATIKA') &&
          !title.includes('PISAVE') &&
          !title.includes('RAZNO') &&
          !title.includes('testno datoteko') &&
          !title.includes('Navodila') &&
          !href.startsWith('../') &&
          !href.includes('index.html')) {
        // Extract year from filename or title
        let year = 'unknown';
        
        // Try to extract from filename first (e.g., 1naravna.html -> 1)
        const filenameMatch = href.match(/^(\d+)[a-z]/);
        if (filenameMatch) {
          year = filenameMatch[1];
        } else {
          // Try to extract from title
          const titleMatch = title.match(/(\d+)\.\s*(letnik|šolsko|testom|kontrolko)/);
          if (titleMatch) {
            year = titleMatch[1];
          }
        }
        
        exercises.push({
          id: href.replace('.html', '').replace(/[^a-zA-Z0-9]/g, '-'),
          title: title.trim(),
          year,
          topic: extractTopic(title),
          content: '', // Will be fetched on demand
          source: `https://www2.arnes.si/~mpavle1/naloge/${href}`
        });
      }
    }
    
    exerciseCache = exercises;
    lastScrape = now;
    return exercises;
  } catch (error) {
    console.error('Scraping failed:', error);
    return exerciseCache || [];
  }
}

function extractTopic(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes('naravna') || lower.includes('cela')) return 'Algebra';
  if (lower.includes('enačb') || lower.includes('neenačb')) return 'Algebra';
  if (lower.includes('funkcij') || lower.includes('linearna')) return 'Funkcije';
  if (lower.includes('kvadratn')) return 'Funkcije';
  if (lower.includes('trigonometrij')) return 'Trigonometrija';
  if (lower.includes('odvod') || lower.includes('integral')) return 'Analiza';
  if (lower.includes('verjetnost') || lower.includes('kombinatorik')) return 'Verjetnost';
  return 'Drugo';
}

export const handler = define.handlers({
  async GET(ctx) {
    const exercises = await scrapeExercises();
    return new Response(JSON.stringify(exercises), {
      headers: { "content-type": "application/json" }
    });
  },
});
