"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PopUpDialogProps } from "../type";
import { primaryButtonStyles, secondaryButtonStyles } from "./styles";
import { prefersReducedMotion } from "./motion";

gsap.registerPlugin(useGSAP);

// a box in the middle of the screen with a dark see-through layer behind it.
// the page decides when to show it, e.g. {showDialog && <PopUpDialog ... />}
const PopUpDialog = ({ title, message, firstButtonText, secondButtonText, onFirstButtonClick, onSecondButtonClick }: PopUpDialogProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // runs once when the popup shows up
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    // the dark layer fades in, and the box fades in while rising a little and growing to full size
    gsap.from(backdropRef.current, { autoAlpha: 0, duration: 0.3 });
    gsap.from(boxRef.current, { autoAlpha: 0, y: 16, scale: 0.96, duration: 0.5, ease: "power2.out" });
  });

  return (
    // fixed + inset-0 makes this layer cover the whole screen, even when the page is scrolled
    <div ref={backdropRef} className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 px-4">
      {/* role and aria-modal tell screen readers this is a popup they need to deal with first */}
      <div
        ref={boxRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="w-full max-w-md xl:max-w-lg rounded-2xl border border-line bg-field p-6 md:p-8 text-center"
      >
        <h2 id="popup-title" className="text-xl md:text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        {/* whitespace-pre-line makes each \n in the message start a new line */}
        {/* long messages scroll inside the box instead of going off the screen */}
        <p className="mt-3 max-h-96 overflow-y-auto whitespace-pre-line text-base md:text-sm xl:text-base text-muted">{message}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button type="button" className={`${primaryButtonStyles} hover:-translate-y-1`} onClick={onFirstButtonClick}>
            {firstButtonText}
          </button>
          {secondButtonText && onSecondButtonClick && (
            <button type="button" className={`${secondaryButtonStyles} hover:-translate-y-1`} onClick={onSecondButtonClick}>
              {secondButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopUpDialog;
