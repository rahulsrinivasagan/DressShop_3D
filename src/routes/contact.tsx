import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — MAISON NOIR" },
      { name: "description", content: "Press, atelier visits, and bespoke inquiries." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setSending(false);

    toast.success("Message sent!", {
      description: "We'll get back to you within 24 hours.",
      duration: 5000,
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />
      <section className="pt-40 pb-32 px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-6 space-y-6"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">Get in Touch</span>
          <h1 className="text-5xl md:text-8xl font-display italic leading-[0.9]">Speak with the studio.</h1>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            For press, bespoke commissions, or to book an atelier viewing, write to us.
            We respond within two working days.
          </p>

          <div className="pt-12 space-y-6">
            {[
              ["Press", "press@avelene.studio"],
              ["Bespoke", "atelier@avelene.studio"],
              ["Studio", "Anna Salai, Chennai 600002, Tamil Nadu, India"],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-border pb-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{k}</p>
                <p className="text-lg font-display italic mt-1">{v}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit}
          className="md:col-span-6 md:pl-12 space-y-8"
        >
          <div className="border-b border-border pb-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((s) => ({ ...s, name: e.target.value }))}
              className="w-full bg-transparent outline-none mt-2 text-lg font-display italic placeholder:text-muted-foreground/30"
            />
          </div>
          <div className="border-b border-border pb-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((s) => ({ ...s, email: e.target.value }))}
              className="w-full bg-transparent outline-none mt-2 text-lg font-display italic placeholder:text-muted-foreground/30"
            />
          </div>
          <div className="border-b border-border pb-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData((s) => ({ ...s, subject: e.target.value }))}
              className="w-full bg-transparent outline-none mt-2 text-lg font-display italic placeholder:text-muted-foreground/30"
            />
          </div>
          <div className="border-b border-border pb-2">
            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Message</label>
            <textarea
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData((s) => ({ ...s, message: e.target.value }))}
              className="w-full bg-transparent outline-none mt-2 text-base font-light resize-none"
            />
          </div>
          <button
            disabled={sending}
            className="px-10 py-4 border border-foreground rounded-full text-[10px] font-mono uppercase tracking-widest hover:bg-foreground hover:text-background transition-all disabled:opacity-60 disabled:pointer-events-none"
          >
            {sending ? "Sending…" : "Send Message"}
          </button>
        </motion.form>
      </section>
      <Footer />
    </main>
  );
}
