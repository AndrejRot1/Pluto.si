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
      // Use access token from props (set by server-side)
      const token = props.accessToken;

      if (!token) {
        // If no token, user is not logged in - redirect to login
        console.log('No access token, redirecting to login');
        window.location.href = '/auth/login';
        return;
      }

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const errorMsg = data.error || "Payment error";
        console.error("Upgrade error:", errorMsg);
        alert(`Error: ${errorMsg}`);
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

