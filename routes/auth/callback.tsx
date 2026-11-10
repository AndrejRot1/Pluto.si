import { define } from "../../utils.ts";
import { Head } from "fresh/runtime";
import OAuthCallback from "../../islands/OAuthCallback.tsx";

export default define.page(function OAuthCallbackPage() {
  return (
    <>
      <Head>
        <title>Prijava • Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <OAuthCallback />
    </>
  );
});
