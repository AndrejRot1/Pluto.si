import { define } from "../../utils.ts";
import { Head } from "fresh/runtime";
import LoginForm from "../../islands/LoginForm.tsx";

export default define.page(function LoginPage() {
  return (
    <>
      <Head>
        <title>Prijava • Pluto.si</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <LoginForm />
    </>
  );
});
