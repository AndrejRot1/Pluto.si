import { define } from "../utils.ts";

/** Vite/Fresh boot scripts import `fresh-island::X.tsx` bare specifiers.
 * Without an import map the browser cannot resolve them, so islands never hydrate
 * (sidebar/topic clicks appear dead). */
const ISLAND_IMPORT_MAP = {
  imports: Object.fromEntries(
    [
      "LoginForm",
      "RegisterForm",
      "ForgotPasswordForm",
      "ResetPasswordForm",
      "YearSidebar",
      "ChatPanel",
      "ChatComposer",
      "Messages",
      "RichContent",
      "ProgressPanel",
      "SettingsPanel",
      "TrialExpired",
      "UpgradeButton",
      "Counter",
    ].map((name) => [
      `fresh-island::${name}.tsx`,
      `/@id/fresh-island::${name}.tsx`,
    ]),
  ),
};

export default define.page(function App({ Component }) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="theme-color" content="#f3f6f4" />
        <title>Pluto.si</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🚀</text></svg>" />
        <script
          type="importmap"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ISLAND_IMPORT_MAP) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" />
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/mhchem.min.js" />
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/function-plot@1.24.0/dist/function-plot.js" />
        <style>{`
          :root {
            --pluto-bg: #f3f6f4;
            --pluto-ink: #0f172a;
            --pluto-accent: #0f766e;
            --pluto-accent-soft: #ccfbf1;
          }
          html, body {
            font-family: Manrope, ui-sans-serif, system-ui, sans-serif;
            color: var(--pluto-ink);
            background: var(--pluto-bg);
            overflow-x: hidden;
            max-width: 100vw;
          }
          .font-display { font-family: Fraunces, Georgia, serif; }
          .katex { font-size: 1.05em; }
          .katex-display { margin: 0.75rem 0; overflow-x: auto; overflow-y: hidden; -webkit-overflow-scrolling: touch; }
          .safe-pb { padding-bottom: max(0.5rem, env(safe-area-inset-bottom, 0px)); }
          .safe-pt { padding-top: env(safe-area-inset-top, 0px); }
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .touch-manipulation { touch-action: manipulation; }
          @media (max-width: 640px) {
            .katex { font-size: 0.95em; }
            .katex-display { margin: 0.5rem 0; }
          }
          @media (min-width: 641px) and (max-width: 1023px) {
            .katex { font-size: 1em; }
          }
        `}</style>
      </head>
      <body class="antialiased safe-pt">
        <Component />
      </body>
    </html>
  );
});
