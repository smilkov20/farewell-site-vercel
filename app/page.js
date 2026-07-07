"use client";

import { useEffect, useState } from "react";
import { COLLEAGUE_NAME, COMPANY_NAME, SUBTITLE } from "@/config";

export default function Home() {
  const [wishes, setWishes] = useState(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null);

  async function load() {
    try {
      const res = await fetch("/api/wishes", { cache: "no-store" });
      const data = await res.json();
      setWishes(data.wishes || []);
    } catch {
      setWishes([]);
    }
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSending(true);
    setNotice(null);
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      setName("");
      setMessage("");
      setNotice({ ok: true, text: "Your wish has been added. Thank you!" });
      await load();
    } catch {
      setNotice({ ok: false, text: "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="wrap">
      <div className="brand">{COMPANY_NAME}</div>

      <section className="hero">
        <h1>
          Farewell, <em>{COLLEAGUE_NAME}</em>
        </h1>
        <div className="divider" />
        <p>{SUBTITLE}</p>
      </section>

      <section className="card">
        <h2>Leave a wish</h2>
        <form onSubmit={submit}>
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
          />
          <label htmlFor="message">Your message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={2000}
            required
          />
          <button type="submit" disabled={sending}>
            {sending ? "Sending…" : "Add my wish"}
          </button>
          {notice && (
            <p className={`notice ${notice.ok ? "ok" : "err"}`}>{notice.text}</p>
          )}
        </form>
      </section>

      <section className="wishes">
        <h2>Wishes</h2>
        {wishes === null && <p className="empty">Loading…</p>}
        {wishes && wishes.length === 0 && (
          <p className="empty">No wishes yet — be the first to write one.</p>
        )}
        {wishes &&
          wishes.map((w, i) => (
            <article className="wish" key={i}>
              <p>{w.message}</p>
              <div className="who">— {w.name}</div>
            </article>
          ))}
      </section>

      <footer>With love, the {COMPANY_NAME} team</footer>
    </main>
  );
}
