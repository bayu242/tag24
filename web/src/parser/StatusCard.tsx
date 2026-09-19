import type { ReactNode } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

type StatusCardProps = {
  tone: "loading" | "error";
  title: string;
  message?: string;
  action?: ReactNode;
};

export function StatusCard({ tone, title, message, action }: StatusCardProps) {
  return (
    <div className="rounded-lg border border-line bg-background px-6 py-14 text-center shadow-card">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-accent-soft">
        {tone === "loading" ? (
          <Loader2 size={26} className="animate-spin text-accent" />
        ) : (
          <AlertTriangle size={26} className="text-danger" />
        )}
      </div>
      <h1 className="mt-4 font-display text-[26px] leading-tight text-ink">{title}</h1>
      {message ? (
        <p className="mx-auto mt-2 max-w-[42ch] text-[15px] leading-6 text-ink/70">{message}</p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
