import { define } from "../../../utils.ts";
import { supabaseAdmin } from "../../../utils/supabase-admin.ts";

export const handler = define.handlers({
  async POST(ctx) {
    try {
      const body = await ctx.req.json();
      const { email } = body;

      if (!email) {
        return Response.json({ error: "Email required" }, { status: 400 });
      }

      console.log("Checking email in Supabase:", email);

      const { data, error } = await supabaseAdmin.auth.admin.listUsers();

      if (error) {
        console.error("Error checking email:", error);
        return Response.json({ exists: false });
      }

      const userExists = data.users.some((user) =>
        user.email?.toLowerCase() === email.toLowerCase()
      );

      return Response.json({ exists: userExists });
    } catch (error) {
      console.error("Check email handler error:", error);
      return Response.json({ exists: false });
    }
  },
});
