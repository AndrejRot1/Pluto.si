// Simplified HTML parser for exercises
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
  // Extract text content, preserving structure
  let content = html
    .replace(/<mjx-container[^>]*>[\s\S]*?<\/mjx-container>/g, (match) => {
      // Extract LaTeX from MathJax
      return convertMathJaxToLatex(match);
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
        return convertMathJaxToLatex(match);
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
  // Extract LaTeX from MathJax HTML - improved approach
  let latex = mathJaxHtml;
  
  // Convert common MathJax elements to LaTeX with better pattern matching
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D434 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'A');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D435 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'B');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D436 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'C');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D437 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'D');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D438 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'E');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D439 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'F');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43A TEX-I"><\/mjx-c><\/mjx-mi>/g, 'G');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43B TEX-I"><\/mjx-c><\/mjx-mi>/g, 'H');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43C TEX-I"><\/mjx-c><\/mjx-mi>/g, 'I');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43D TEX-I"><\/mjx-c><\/mjx-mi>/g, 'J');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43E TEX-I"><\/mjx-c><\/mjx-mi>/g, 'K');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D43F TEX-I"><\/mjx-c><\/mjx-mi>/g, 'L');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D440 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'M');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D441 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'N');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D442 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'O');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D443 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'P');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D444 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'Q');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D445 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'R');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D446 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'S');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D447 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'T');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D448 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'U');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D449 TEX-I"><\/mjx-c><\/mjx-mi>/g, 'V');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D44A TEX-I"><\/mjx-c><\/mjx-mi>/g, 'W');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D44B TEX-I"><\/mjx-c><\/mjx-mi>/g, 'X');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D44C TEX-I"><\/mjx-c><\/mjx-mi>/g, 'Y');
  latex = latex.replace(/<mjx-mi class="mjx-i"><mjx-c class="mjx-c1D44D TEX-I"><\/mjx-c><\/mjx-mi>/g, 'Z');
  
  // Convert operators with better spacing
  latex = latex.replace(/<mjx-mo class="mjx-n" space="3"><mjx-c class="mjx-c2227"><\/mjx-c><\/mjx-mo>/g, ' \\land ');
  latex = latex.replace(/<mjx-mo class="mjx-n" space="3"><mjx-c class="mjx-c2228"><\/mjx-c><\/mjx-mo>/g, ' \\lor ');
  latex = latex.replace(/<mjx-mo class="mjx-n" space="4"><mjx-c class="mjx-c21D2"><\/mjx-c><\/mjx-mo>/g, ' \\Rightarrow ');
  latex = latex.replace(/<mjx-mi class="mjx-n"><mjx-c class="mjx-cAC"><\/mjx-c><\/mjx-mi>/g, '\\lnot ');
  latex = latex.replace(/<mjx-mo class="mjx-n"><mjx-c class="mjx-c28"><\/mjx-c><\/mjx-mo>/g, '(');
  latex = latex.replace(/<mjx-mo class="mjx-n"><mjx-c class="mjx-c29"><\/mjx-c><\/mjx-mo>/g, ')');
  latex = latex.replace(/<mjx-mo class="mjx-n"><mjx-c class="mjx-c7B"><\/mjx-c><\/mjx-mo>/g, '\\{');
  latex = latex.replace(/<mjx-mo class="mjx-n"><mjx-c class="mjx-c7D"><\/mjx-c><\/mjx-mo>/g, '\\}');
  latex = latex.replace(/<mjx-mo class="mjx-n"><mjx-c class="mjx-c3D"><\/mjx-c><\/mjx-mo>/g, '=');
  latex = latex.replace(/<mjx-mo class="mjx-n"><mjx-c class="mjx-c2C"><\/mjx-c><\/mjx-mo>/g, ',');
  latex = latex.replace(/<mjx-mo class="mjx-n"><mjx-c class="mjx-c3B"><\/mjx-c><\/mjx-mo>/g, ';');
  
  // Convert numbers
  latex = latex.replace(/<mjx-mn class="mjx-n"><mjx-c class="mjx-c30"><\/mjx-c><\/mjx-mn>/g, '0');
  latex = latex.replace(/<mjx-mn class="mjx-n"><mjx-c class="mjx-c31"><\/mjx-c><\/mjx-mn>/g, '1');
  latex = latex.replace(/<mjx-mn class="mjx-n"><mjx-c class="mjx-c32"><\/mjx-c><\/mjx-mn>/g, '2');
  latex = latex.replace(/<mjx-mn class="mjx-n"><mjx-c class="mjx-c33"><\/mjx-c><\/mjx-mn>/g, '3');
  latex = latex.replace(/<mjx-mn class="mjx-n"><mjx-c class="mjx-c34"><\/mjx-c><\/mjx-mn>/g, '4');
  latex = latex.replace(/<mjx-mn class="mjx-n"><mjx-c class="mjx-c35"><\/mjx-c><\/mjx-mn>/g, '5');
  latex = latex.replace(/<mjx-mn class="mjx-n"><mjx-c class="mjx-c36"><\/mjx-c><\/mjx-mn>/g, '6');
  latex = latex.replace(/<mjx-mn class="mjx-n"><mjx-c class="mjx-c37"><\/mjx-c><\/mjx-mn>/g, '7');
  latex = latex.replace(/<mjx-mn class="mjx-n"><mjx-c class="mjx-c38"><\/mjx-c><\/mjx-mn>/g, '8');
  latex = latex.replace(/<mjx-mn class="mjx-n"><mjx-c class="mjx-c39"><\/mjx-c><\/mjx-mn>/g, '9');
  
  // Convert fractions
  latex = latex.replace(/<mjx-mfrac[^>]*>([\s\S]*?)<\/mjx-mfrac>/g, (match, content) => {
    const parts = content.split(/<mjx-mrow[^>]*>([\s\S]*?)<\/mjx-mrow>/);
    if (parts.length >= 3) {
      const numerator = parts[1].replace(/<[^>]+>/g, '').trim();
      const denominator = parts[3].replace(/<[^>]+>/g, '').trim();
      return `\\frac{${numerator}}{${denominator}}`;
    }
    return match;
  });
  
  // Convert square roots
  latex = latex.replace(/<mjx-msqrt[^>]*>([\s\S]*?)<\/mjx-msqrt>/g, (match, content) => {
    const radicand = content.replace(/<[^>]+>/g, '').trim();
    return `\\sqrt{${radicand}}`;
  });
  
  // Clean up any remaining tags and extra spaces
  latex = latex.replace(/<[^>]+>/g, '');
  latex = latex.replace(/\s+/g, ' ').trim();
  
  return `$${latex}$`;
}
