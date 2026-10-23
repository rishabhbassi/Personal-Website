import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusable(container) {
  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
    (element) =>
      element.getClientRects().length > 0 &&
      element.getAttribute("aria-hidden") !== "true",
  );
}

/**
 * Keeps keyboard focus inside a full-screen dialog, closes it with Escape and
 * returns focus to the element that opened it. Dialogs still own their markup,
 * scroll container and role/aria attributes.
 */
export default function useDialogFocus(onRequestClose) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onRequestClose);

  useEffect(() => {
    closeRef.current = onRequestClose;
  }, [onRequestClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const previouslyFocused = document.activeElement;
    const focusFrame = window.requestAnimationFrame(() => {
      const preferred = dialog.querySelector("[data-autofocus]");
      const target = preferred ?? getFocusable(dialog)[0] ?? dialog;
      target.focus({ preventScroll: true });
    });

    const handleKeyDown = (event) => {
      // A dialog that is stacked beneath another one (and therefore made inert)
      // must not react to Escape or Tab meant for the topmost surface.
      if (dialog.closest("[inert]")) return;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      if (
        previouslyFocused instanceof HTMLElement &&
        document.contains(previouslyFocused) &&
        !previouslyFocused.closest("[inert]")
      ) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, []);

  return dialogRef;
}
