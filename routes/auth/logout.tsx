import { define } from "../../utils.ts";
import { clearAuthSetCookieHeaders } from "../../utils/auth-cookies.ts";

export const handler = define.handlers({
  GET(_ctx) {
    const headers = new Headers({ Location: "/auth/login" });
    for (const c of clearAuthSetCookieHeaders()) {
      headers.append("Set-Cookie", c);
    }
    return new Response(null, { status: 302, headers });
  },
});
