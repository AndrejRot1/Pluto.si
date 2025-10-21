import { define } from "../../utils.ts";
import ForgotPasswordForm from "../../islands/ForgotPasswordForm.tsx";

export default define.page(function ForgotPassword() {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pozabljeno geslo - Pluto.si</title>
      </head>
      <body>
        <ForgotPasswordForm />
      </body>
    </html>
  );
});

