import { define } from "../utils.ts";
import { Head } from "fresh/runtime";
import TrialExpired from "../islands/TrialExpired.tsx";

export default define.page(function TrialExpiredPage() {
  return (
    <>
      <Head>
        <title>Trial Expired - Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <TrialExpired />
    </>
  );
});
