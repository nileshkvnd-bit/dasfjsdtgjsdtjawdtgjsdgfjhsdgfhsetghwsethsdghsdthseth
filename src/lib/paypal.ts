// Minimal PayPal REST API client. Uses sandbox or live base URL
// depending on PAYPAL_ENV (defaults to sandbox for safety).
const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const basicAuth = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal auth failed: ${res.status}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function createPaypalOrder(params: {
  amount: string; // e.g. "15.00"
  currency: string; // e.g. "USD"
  returnUrl: string;
  cancelUrl: string;
}) {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: params.currency,
            value: params.amount,
          },
          description: "Kyron — Lifetime License",
        },
      ],
      application_context: {
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
        user_action: "PAY_NOW",
        brand_name: "Kyron",
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal order creation failed: ${res.status} ${body}`);
  }

  const data = await res.json();
  const approveLink = data.links?.find(
    (l: { rel: string; href: string }) => l.rel === "approve"
  );

  return { orderId: data.id as string, approveUrl: approveLink?.href as string };
}

export async function capturePaypalOrder(orderId: string) {
  const token = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PayPal capture failed: ${res.status} ${body}`);
  }

  return res.json();
}
