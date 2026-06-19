/**
 * Optional Node/Express API for Gotch Studio.
 *
 * The marketing site is a fully static export and needs none of this to run.
 * Deploy this only if you want server-backed inquiries, newsletter, and booking
 * (e.g. via the cPanel "Setup Node.js App" tool). It writes to the SQLite
 * database described in ../prisma/schema.prisma.
 *
 * Endpoints:
 *   POST /api/inquiry      { name, email, phone?, location?, type?, budget?, message }
 *   POST /api/subscribe    { email, locale? }
 *   POST /api/consultation { name?, email?, date, slot, mode? }
 *   GET  /api/health
 *
 * Wire the frontend by replacing the mocked submit handlers in
 * components/shared/Newsletter.tsx, components/contact/ContactForm.tsx, and
 * components/contact/BookingWidget.tsx with fetch() calls to these routes, and
 * set NEXT_PUBLIC_API_URL accordingly.
 */
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/api/inquiry", async (req, res) => {
  try {
    const { name, email, message } = req.body ?? {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    const inquiry = await prisma.inquiry.create({ data: req.body });
    // TODO: send notification email (e.g. nodemailer / Resend).
    res.status(201).json({ id: inquiry.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

app.post("/api/subscribe", async (req, res) => {
  try {
    const { email, locale = "en" } = req.body ?? {};
    if (!email) return res.status(400).json({ error: "Email required." });
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { locale },
      create: { email, locale },
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

app.post("/api/consultation", async (req, res) => {
  try {
    const { date, slot } = req.body ?? {};
    if (!date || !slot)
      return res.status(400).json({ error: "Date and slot required." });
    const booking = await prisma.consultation.create({
      data: { ...req.body, date: new Date(date) },
    });
    res.status(201).json({ id: booking.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Gotch API listening on :${port}`));
