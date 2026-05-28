import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="py-16 px-6 md:px-8 border-t border-border flex flex-col md:flex-row justify-between items-start gap-12">
      <div className="space-y-6">
        <div className="text-2xl font-display italic font-semibold">MAISON NOIR</div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground max-w-[220px] leading-relaxed">
          Cinematic fashion. Quietly engineered in Chennai.
        </p>
        <div className="flex gap-6">
          {["Instagram", "Pinterest", "Vimeo"].map((s) => (
            <a
              key={s}
              href="#"
              className="text-[9px] font-mono uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-accent transition-all"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16">
        <div className="space-y-4">
          <span className="text-[9px] font-mono uppercase tracking-widest text-accent">Shop</span>
          <ul className="space-y-2 text-[10px] font-mono opacity-60">
            <li>
              <Link to="/shop" className="hover:text-foreground">
                New Arrivals
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-foreground">
                Collections
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-foreground">
                Accessories
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <span className="text-[9px] font-mono uppercase tracking-widest text-accent">Studio</span>
          <ul className="space-y-2 text-[10px] font-mono opacity-60">
            <li>
              <Link to="/about" className="hover:text-foreground">
                Philosophy
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-foreground">
                Account
              </Link>
            </li>
          </ul>
        </div>
        <div className="hidden md:block space-y-4">
          <span className="text-[9px] font-mono uppercase tracking-widest text-accent">Global</span>
          <p className="text-[10px] font-mono opacity-60 leading-relaxed">
            New York / London
            <br />
            Chennai / Tokyo
          </p>
        </div>
      </div>
    </footer>
  );
}
