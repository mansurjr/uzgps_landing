const MAX = 200;

const clean = (v: unknown) => (typeof v === "string" ? v.trim().slice(0, MAX) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const lead = {
    name: clean(body.name),
    phone: clean(body.phone),
    email: clean(body.email),
    company: clean(body.company),
    fleet: clean(body.fleet),
    interest: clean(body.interest),
  };

  if (!lead.name || !/^[+\d\s()-]{7,20}$/.test(lead.phone)) {
    return Response.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) {
    console.error("[lead] Telegram delivery is not configured");
    return Response.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const text = [
    "Новая заявка с сайта",
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    lead.email && `E-mail: ${lead.email}`,
    lead.company && `Компания: ${lead.company}`,
    lead.fleet && `Машин: ${lead.fleet}`,
    lead.interest && `Интересует: ${lead.interest}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chat, text }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error(`Telegram returned ${res.status}`);
  } catch {
    console.error("[lead] Telegram delivery failed");
    return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
