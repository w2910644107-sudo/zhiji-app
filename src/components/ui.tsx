import Link from "next/link";
import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function PageHeader({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <section className="mb-8 sm:mb-10">
      <h1 className="font-song text-4xl font-semibold leading-tight text-ink sm:text-5xl">
        {title}
      </h1>
      {eyebrow ? (
        <p className="mt-3 text-sm text-smoke/75">{eyebrow}</p>
      ) : null}
      {description ? (
        <p className="mt-4 max-w-2xl text-base leading-8 text-smoke sm:text-lg">
          {description}
        </p>
      ) : null}
    </section>
  );
}

export function Card({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-gold-soft/80 bg-white/70 p-6 shadow-card backdrop-blur ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
}) {
  const styles =
    variant === "primary"
      ? "bg-cinnabar text-white shadow-lg shadow-cinnabar/10 hover:bg-[#922e25]"
      : "border border-gold-soft bg-white/64 text-ink hover:bg-white";

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  const styles =
    variant === "primary"
      ? "bg-cinnabar text-white shadow-lg shadow-cinnabar/10 hover:bg-[#922e25]"
      : "border border-gold-soft bg-white/64 text-ink hover:bg-white";

  return (
    <Link
      className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition hover:-translate-y-0.5 ${styles} ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
}

export function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`min-h-12 w-full rounded-2xl border border-gold-soft/90 bg-white/68 px-4 text-ink outline-none transition placeholder:text-smoke/55 focus:border-gold focus:bg-white ${className}`}
      {...props}
    />
  );
}

export function TextArea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`min-h-36 w-full resize-none rounded-[24px] border border-gold-soft/90 bg-white/68 p-4 leading-7 text-ink outline-none transition placeholder:text-smoke/55 focus:border-gold focus:bg-white ${className}`}
      {...props}
    />
  );
}

export function SelectInput({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`min-h-12 w-full rounded-2xl border border-gold-soft/90 bg-white/68 px-4 text-ink outline-none transition focus:border-gold focus:bg-white ${className}`}
      {...props}
    />
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-song text-2xl font-semibold text-ink sm:text-3xl">
      {children}
    </h2>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-smoke">
      <span>{label}</span>
      {children}
    </label>
  );
}

export function KeyValue({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gold-soft/70 bg-white/52 p-4">
      <dt className="text-xs font-medium text-smoke">{label}</dt>
      <dd className="mt-2 text-base leading-7 text-ink">{value}</dd>
    </div>
  );
}
