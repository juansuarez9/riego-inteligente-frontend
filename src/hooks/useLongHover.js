import { useCallback, useEffect, useRef, useState } from "react";

export const HOLD_MS = 5000;

const NO_EXPAND_SELECTOR = "button, a, input, select, textarea, [data-no-focus]";

export function useLongHover() {
  const containerRef = useRef(null);
  const pointerInsideRef = useRef(false);
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [focused, setFocused] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const clearTimers = useCallback(() => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
  }, []);

  const cancelHold = useCallback(() => {
    pointerInsideRef.current = false;
    clearTimers();
    setIsHovering(false);
    setProgress(0);
  }, [clearTimers]);

  const openFocus = useCallback(() => {
    pointerInsideRef.current = false;
    clearTimers();
    setIsHovering(false);
    setProgress(0);
    setFocused(true);
  }, [clearTimers]);

  const closeFocus = useCallback(() => {
    cancelHold();
    setFocused(false);
  }, [cancelHold]);

  const startHold = useCallback(() => {
    if (focused) return;

    pointerInsideRef.current = true;
    setIsHovering(true);
    const start = Date.now();

    intervalRef.current = setInterval(() => {
      if (!pointerInsideRef.current) return;
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / HOLD_MS) * 100));
    }, 40);

    timeoutRef.current = setTimeout(() => {
      if (!pointerInsideRef.current) return;
      openFocus();
    }, HOLD_MS);
  }, [focused, openFocus]);

  const onPointerEnter = useCallback(() => {
    startHold();
  }, [startHold]);

  const onPointerLeave = useCallback((event) => {
    if (focused) return;

    const related = event.relatedTarget;
    if (related && containerRef.current?.contains(related)) {
      return;
    }

    cancelHold();
  }, [focused, cancelHold]);

  const onClick = useCallback((event) => {
    if (event.target.closest(NO_EXPAND_SELECTOR)) {
      return;
    }
    openFocus();
  }, [openFocus]);

  useEffect(() => {
    if (!isHovering || focused) return undefined;

    const verifyPointer = (event) => {
      const el = containerRef.current;
      if (!el) return;

      const target = event.target;
      if (target instanceof Node && el.contains(target)) {
        if (!pointerInsideRef.current) {
          pointerInsideRef.current = true;
        }
        return;
      }

      if (pointerInsideRef.current) {
        cancelHold();
      }
    };

    document.addEventListener("pointermove", verifyPointer, { passive: true });
    document.addEventListener("pointerdown", verifyPointer, { passive: true });

    return () => {
      document.removeEventListener("pointermove", verifyPointer);
      document.removeEventListener("pointerdown", verifyPointer);
    };
  }, [isHovering, focused, cancelHold]);

  useEffect(() => {
    if (!focused) return undefined;

    document.body.classList.add("focus-mode-active");

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeFocus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("focus-mode-active");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [focused, closeFocus]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    containerRef,
    isHovering,
    progress,
    focused,
    closeFocus,
    interactionHandlers: {
      onPointerEnter,
      onPointerLeave,
      onClick,
    },
  };
}
