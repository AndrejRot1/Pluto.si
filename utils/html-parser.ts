// Parser za HTML naloge iz arnes.si
export function parseHtmlExercises(htmlContent: string) {
  const exercises: any[] = [];
  
  // Find all <li class="razprto"> elements
  const liRegex = /<li class="razprto">([\s\S]*?)<\/li>/g;
  let match;
  let exerciseIndex = 1;
  
  while ((match = liRegex.exec(htmlContent)) !== null) {
    const exerciseHtml = match[1];
    
    // Extract exercise content
    const exercise = parseExerciseContent(exerciseHtml, exerciseIndex);
    if (exercise) {
      exercises.push(exercise);
      exerciseIndex++;
    }
  }
  
  return exercises;
}

function parseExerciseContent(html: string, index: number) {
  // Remove HTML tags but preserve structure
  let content = html
    .replace(/<mjx-container[^>]*>[\s\S]*?<\/mjx-container>/g, (match) => {
      // Extract LaTeX from MathJax
      const mathMatch = match.match(/<mjx-math[^>]*>([\s\S]*?)<\/mjx-math>/);
      if (mathMatch) {
        return convertMathJaxToLatex(mathMatch[1]);
      }
      return '';
    })
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<p class="zamik[^"]*">/g, '\n')
    .replace(/<\/p>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Extract title (first line)
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return null;
  
  const title = lines[0].trim();
  const exerciseContent = lines.slice(1).join('\n').trim();
  
  // Find solution
  const solutionMatch = html.match(/<span id="res\d+"[^>]*>([\s\S]*?)<\/span>/);
  let solution = '';
  if (solutionMatch) {
    solution = solutionMatch[1]
      .replace(/<mjx-container[^>]*>[\s\S]*?<\/mjx-container>/g, (match) => {
        const mathMatch = match.match(/<mjx-math[^>]*>([\s\S]*?)<\/mjx-math>/);
        if (mathMatch) {
          return convertMathJaxToLatex(mathMatch[1]);
        }
        return '';
      })
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  return {
    id: `exercise-${index}`,
    title: title,
    content: exerciseContent,
    solution: solution ? `**Rešitev:** ${solution}` : undefined
  };
}

function convertMathJaxToLatex(mathJaxHtml: string): string {
  // This is a simplified conversion - in practice you'd need a more sophisticated parser
  // For now, we'll extract common patterns and convert them to LaTeX
  
  let latex = mathJaxHtml;
  
  // Convert common MathJax elements to LaTeX
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D434 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'A');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D435 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'B');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D436 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'C');
  latex = latex.replace(/<mjx-mo class="mjx-n" space="3"><mjx-c class="mjx-c2227"><\/mjx-c><\/mjx-mo>/g, '\\land');
  latex = latex.replace(/<mjx-mo class="mjx-n" space="3"><mjx-c class="mjx-c2228"><\/mjx-c><\/mjx-mo>/g, '\\lor');
  latex = latex.replace(/<mjx-mo class="mjx-n" space="4"><mjx-c class="mjx-c21D2"><\/mjx-c><\/mjx-mo>/g, '\\Rightarrow');
  latex = latex.replace(/<mjx-mi class="mjx-n"><mjx-c class="mjx-cAC"><\/mjx-c><\/mjx-mi>/g, '\\lnot');
  latex = latex.replace(/<mjx-mo class="mjx-n"><mjx-c class="mjx-c28"><\/mjx-c><\/mjx-mo>/g, '(');
  latex = latex.replace(/<mjx-mo class="mjx-n"><mjx-c class="mjx-c29"><\/mjx-c><\/mjx-mo>/g, ')');
  
  // Clean up any remaining tags
  latex = latex.replace(/<[^>]+>/g, '');
  
  return `$${latex}$`;
}
