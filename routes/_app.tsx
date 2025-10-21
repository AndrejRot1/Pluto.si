import { define } from "../utils.ts";

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pluto.si</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" />
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/function-plot@1.24.0/dist/function-plot.js" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
});
