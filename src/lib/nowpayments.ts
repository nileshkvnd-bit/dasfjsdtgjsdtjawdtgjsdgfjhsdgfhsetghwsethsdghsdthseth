// Minimal NOWPayments REST client.
const NOWPAYMENTS_BASE = "https://api.nowpayments.io/v1";

export async function createNowPaymentsInvoice(params: {
  priceAmount: number; // e.g. 15
  priceCurrency: string; // e.g. "usd"
  orderId: string; // our own reference id
  successUrl: string;
  cancelUrl: string;
}) {
  const res = await fetch(`${NOWPAYMENTS_BASE}/invoice`, {
    method: "POST",
    headers: {
      "x-api-key": process.env.NOWPAYMENTS_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      price_amount: params.priceAmount,
      price_currency: params.priceCurrency,
      order_id: params.orderId,
      order_description: "Kyron — Lifetime License",
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`NOWPayments invoice creation failed: ${res.status} ${body}`);
  }

  return res.json() as Promise<{ id: string; invoice_url: string }>;
}
