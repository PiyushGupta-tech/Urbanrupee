"use strict";

const path = require("path");
const express = require("express");
const compression = require("compression");
const nodemailer = require("nodemailer");

const ROOT = path.join(__dirname, "Urbanrupee");
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === "production";

const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: false }));

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

app.post("/api/contact", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const phone = String(req.body?.phone || "").trim();
  const subject = String(req.body?.subject || "").trim();
  const message = String(req.body?.message || "").trim();

  if (name.length < 2) {
    return res.status(400).json({ ok: false, message: "Name must be at least 2 characters." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, message: "Enter a valid email address." });
  }
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({ ok: false, message: "Phone number must be exactly 10 digits." });
  }
  if (subject.length < 3) {
    return res.status(400).json({ ok: false, message: "Subject must be at least 3 characters." });
  }
  if (message.length < 10) {
    return res.status(400).json({ ok: false, message: "Message must be at least 10 characters." });
  }

  const smtpHost = process.env.CONTACT_SMTP_HOST;
  const smtpPort = Number(process.env.CONTACT_SMTP_PORT || 587);
  const smtpUser = process.env.CONTACT_SMTP_USER;
  const smtpPass = process.env.CONTACT_SMTP_PASS;
  const toEmail = process.env.CONTACT_TO_EMAIL || "it.support@urbanrupee.com";
  const fromEmail = process.env.CONTACT_FROM_EMAIL || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !fromEmail) {
    return res.status(503).json({
      ok: false,
      message:
        "Contact mail server is not configured. Set CONTACT_SMTP_HOST, CONTACT_SMTP_PORT, CONTACT_SMTP_USER, CONTACT_SMTP_PASS, and CONTACT_FROM_EMAIL.",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return res.json({ ok: true, message: "Message sent successfully." });
  } catch (error) {
    console.error("Contact form mail error:", error);
    return res.status(502).json({
      ok: false,
      message: "Failed to send message from server. Please try again.",
    });
  }
});

app.use(
  compression({
    threshold: 860,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);

app.use(
  express.static(ROOT, {
    index: "index.html",
    extensions: ["html"],
    etag: true,
    lastModified: true,
    setHeaders(res, filePath) {
      const rel = path.relative(ROOT, filePath).replace(/\\/g, "/");

      if (rel.endsWith(".html") || rel === "" || rel === ".") {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        return;
      }

      if (rel.startsWith("assets/")) {
        res.setHeader(
          "Cache-Control",
          isProd ? "public, max-age=2592000" : "public, max-age=0"
        );
        return;
      }

      res.setHeader("Cache-Control", "public, max-age=3600");
    },
  })
);

app.listen(PORT, () => {
  console.log(`Urbanrupee site → http://localhost:${PORT}/`);
  console.log(`NODE_ENV=${process.env.NODE_ENV || "development"} (production: 30-day cache for /assets/)`);
});
