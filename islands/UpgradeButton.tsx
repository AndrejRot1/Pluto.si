import { useState } from "preact/hooks";

export default function UpgradeButton(props: {
  class?: string;
  text: string;
  accessToken?: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpgrade() {
    if (loading) return;
    setLoading(true);

    try {
      // Get access token from cookie if not provided
      let token = props.accessToken;
      if (!token) {
        const cookies = document.cookie.split(';');
        const accessTokenCookie = cookies.find(c => c.trim().startsWith('sb-access-token='));
        token = accessTokenCookie ? accessTokenCookie.split('=')[1] : '';
      }

      if (!token) {
        alert('Not logged in');
        window.location.href = '/auth/login';
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        alert(`Error: ${data.error || "Payment error"}`);
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      alert("Connection error");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      class={props.class}
    >
      {loading ? "Loading..." : props.text}
    </button>
  );
}

