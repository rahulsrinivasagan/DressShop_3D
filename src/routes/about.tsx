import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import studio from "@/assets/studio.jpg";
import fabric from "@/assets/fabric.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MAISON NOIR" },
      { name: "description", content: "MAISON NOIR is a cinematic Chennai fashion house exploring the architecture of silk." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <main className="bg-background text-foreground">
      <Nav />
      <section className="pt-40 pb-32 px-6 md:px-12 max-w-6xl">
        <motion.span
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}
          className="font-mono text-[10px] uppercase tracking-widest text-accent"
        >
          The House
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-9xl font-display italic mt-6 leading-[0.9] text-balance"
        >
          A studio of <em>quiet</em> rebellion.
        </motion.h1>
      </section>

      <section className="px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 pb-32">
        <div className="md:col-span-7 aspect-[4/5] overflow-hidden">
          <img src={studio} alt="Studio" loading="lazy" width={1024} height={1280} className="w-full h-full object-cover" />
        </div>
        <div className="md:col-span-5 md:pl-8 flex flex-col justify-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-display leading-tight">Founded in Chennai, 2019.</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            MAISON NOIR was founded by a circle of pattern makers, photographers, and silk
            weavers obsessed with one question: how does light pass through a garment?
            Every collection answers that question differently.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We design four releases a year. We never restock. Each piece is hand-finished
            in the Marais and shipped within six weeks of order.
          </p>
        </div>
      </section>

      <section className="bg-foreground text-background py-32 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            ["07", "Years of practice"],
            ["48", "Pieces per release"],
            ["100%", "Made in France"],
          ].map(([n, l]) => (
            <div key={l} className="space-y-4">
              <div className="text-7xl md:text-8xl font-display italic">{n}</div>
              <p className="text-[10px] font-mono uppercase tracking-widest">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-32 px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-5 md:pr-8 space-y-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent">The Atelier</span>
          <h3 className="text-4xl md:text-5xl font-display leading-tight">Where the work happens.</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            On the third floor of a former printmaking studio, our team works in silence
            with long-loomed silk and Italian wool. Visits by appointment.
          </p>
        </div>
        <div className="md:col-span-7 aspect-[4/3] overflow-hidden">
          <img src={fabric} alt="Fabric study" loading="lazy" width={1024} height={1024} className="w-full h-full object-cover" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
