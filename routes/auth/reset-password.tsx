import { define } from "../../utils.ts";
import ResetPasswordForm from "../../islands/ResetPasswordForm.tsx";

export default define.page(function ResetPassword() {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ponastavitev gesla - Pluto.si</title>
      </head>
      <body>
        <ResetPasswordForm />
      </body>
    </html>
  );
});

