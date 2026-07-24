// ==================================================================
// Casa Lúdica Moema — notificação de novo lead por e-mail (Vercel Function)
// Só funciona quando o site está publicado na Vercel com as variáveis de
// ambiente configuradas (veja SETUP.md, seção "Notificação por e-mail").
// Se não estiver configurado, o site apenas ignora esta chamada — o lead
// continua salvo no banco (Supabase) e visível no admin.
// =====================================================================
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const KEY = process.env.RESEND_API_KEY;
  const TO = process.env.NOTIFY_TO;                       // ex: seuemail@gmail.com
  const FROM = process.env.NOTIFY_FROM || "Casa Lúdica <onboarding@resend.dev>";

  // Sem configuração de e-mail: não é erro — apenas nada a enviar.
  if (!KEY || !TO) {
    return res.status(200).json({ ok: true, emailed: false });
  }

  try {
    const { email, category } = req.body || {};
    if (!email) return res.status(400).json({ error: "email obrigatório" });

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        subject: `Novo interessado — ${category || "Catálogo"} · Casa Lúdica Moema`,
        html: `<div style="font-family:Arial,sans-serif;color:#373A81">
          <h2 style="margin:0 0 8px">Novo lead no catálogo</h2>
          <p style="margin:0"><b>E-mail:</b> ${escapeHtml(email)}</p>
          <p style="margin:4px 0 0"><b>Categoria:</b> ${escapeHtml(category || "-")}</p>
          <p style="margin:12px 0 0;color:#6a6ca6;font-size:13px">Enviado automaticamente pelo site.</p>
        </div>`,
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return res.status(200).json({ ok: true, emailed: false, detail: t });
    }
    return res.status(200).json({ ok: true, emailed: true });
  } catch (e) {
    return res.status(200).json({ ok: true, emailed: false, error: String(e) });
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}
