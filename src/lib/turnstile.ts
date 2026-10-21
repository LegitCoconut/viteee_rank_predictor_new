// Hostnames come from TURNSTILE_HOSTNAMES (comma-separated); localhost is allowed outside production only.
export async function verifyTurnstile(token: string, action: string): Promise<boolean> {
  const allowed = (process.env.TURNSTILE_HOSTNAMES ?? "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
  if (process.env.NODE_ENV !== "production") allowed.push("localhost", "127.0.0.1");

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ?? "",
      response: token,
    }),
  });
  const data = await res.json();
  return data.success === true && data.action === action && allowed.includes(data.hostname);
}
