import { X } from "lucide-react";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  showClose?: boolean;
  padding?: boolean;
  contentClassName?: string;
  overlayClassName?: string;
}

const sizeClassMap = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
} as const;

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showClose = true,
  padding = true,
  contentClassName,
  overlayClassName,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const { body, documentElement } = document;
    const currentLockCount = Number(body.dataset.modalLockCount ?? "0");

    if (currentLockCount === 0) {
      body.dataset.modalPrevOverflow = body.style.overflow;
      body.dataset.modalPrevPaddingRight = body.style.paddingRight;

      const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
      body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    body.dataset.modalLockCount = String(currentLockCount + 1);

    return () => {
      const nextLockCount = Math.max(0, Number(body.dataset.modalLockCount ?? "1") - 1);
      body.dataset.modalLockCount = String(nextLockCount);

      if (nextLockCount === 0) {
        body.style.overflow = body.dataset.modalPrevOverflow ?? "";
        body.style.paddingRight = body.dataset.modalPrevPaddingRight ?? "";
        delete body.dataset.modalLockCount;
        delete body.dataset.modalPrevOverflow;
        delete body.dataset.modalPrevPaddingRight;
      }
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={cn(
        "animate-overlay-in fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 motion-reduce:animate-none",
        overlayClassName,
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "animate-surface-in w-full rounded-2xl border border-border bg-card shadow-soft motion-reduce:animate-none",
          padding && "p-5 sm:p-6",
          sizeClassMap[size],
          contentClassName,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || description || showClose) && (
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              {title ? <h3 className="text-xl font-semibold leading-tight">{title}</h3> : null}
              {description ? (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              ) : null}
            </div>
            {showClose ? (
              <button
                aria-label="Close"
                className="transition-smooth grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
                onClick={onClose}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
