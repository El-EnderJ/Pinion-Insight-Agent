/**
 * @component Footer
 * Minimal footer with PinionOS attribution, developer credit, and hackathon info.
 */

export default function Footer() {
  return (
    <footer className="border-t border-card-border py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span>Built with</span>
            <a
              href="https://github.com/chu2bard/pinion-os"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline font-semibold"
            >
              PinionOS
            </a>
            <span>•</span>
            <span>x402 Micropayments on Base</span>
          </div>
          <div className="text-foreground/60 font-medium tracking-wide">
            Developed by{" "}
            <span className="text-gradient font-semibold">Ender Designs</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://x.com/PinionOS"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              @PinionOS
            </a>
            <span className="text-muted/40">|</span>
            <span className="text-accent/60">PinionOS Hackathon 2025</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
