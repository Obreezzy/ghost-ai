import { CheckCircle2, Ghost } from "lucide-react";

const features = [
  "Design system architectures on a shared canvas",
  "Review and refine with your team in real time",
  "Generate a technical spec from your design",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-base lg:grid-cols-2">
      <section className="hidden flex-col justify-center gap-10 bg-surface px-12 lg:flex">
        <div className="group flex w-fit items-center gap-3">
          <Ghost
            className="h-9 w-9 text-brand transition-transform duration-300 group-hover:-translate-y-0.5"
            aria-hidden
          />
          <span className="text-xl font-semibold tracking-tight text-copy-primary">
            Ghost AI
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-copy-primary">
            Real-time collaborative system design.
          </h1>
          <p className="max-w-sm text-[15px] leading-relaxed text-copy-secondary">
            Ghost AI maps your system onto a shared canvas and generates a
            technical specification from the final design.
          </p>
        </div>
        <ul className="flex flex-col gap-4">
          {features.map((feature) => (
            <li
              key={feature}
              className="group flex w-fit cursor-default items-center gap-3 text-[15px] text-copy-secondary transition-colors duration-200 hover:text-copy-primary"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand transition-transform duration-200 group-hover:scale-110" />
              {feature}
            </li>
          ))}
        </ul>
      </section>
      <main className="flex min-h-dvh items-center justify-center bg-base px-6 py-12">
        <div className="w-full max-w-[28rem] rounded-2xl transition-shadow duration-300 hover:shadow-[0_0_48px_-12px_var(--accent-primary)]">
          {children}
        </div>
      </main>
    </div>
  );
}