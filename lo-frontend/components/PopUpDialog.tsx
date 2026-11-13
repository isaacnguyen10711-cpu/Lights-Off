import { PopUpDialogProps } from "../type";
import { primaryButtonStyles, secondaryButtonStyles } from "./styles";

// a box in the middle of the screen with a dark see-through layer behind it.
// the page decides when to show it, e.g. {showDialog && <PopUpDialog ... />}
const PopUpDialog = ({ title, message, firstButtonText, secondButtonText, onFirstButtonClick, onSecondButtonClick }: PopUpDialogProps) => {
  return (
    // fixed + inset-0 makes this layer cover the whole screen, even when the page is scrolled
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 px-4">
      {/* role and aria-modal tell screen readers this is a popup they need to deal with first */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="w-full max-w-md xl:max-w-lg rounded-2xl border border-line bg-field p-6 md:p-8 text-center"
      >
        <h2 id="popup-title" className="text-xl md:text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-3 text-base md:text-sm xl:text-base text-muted">{message}</p>

        <div className="mt-6 flex justify-center gap-3">
          <button type="button" className={primaryButtonStyles} onClick={onFirstButtonClick}>
            {firstButtonText}
          </button>
          {secondButtonText && onSecondButtonClick && (
            <button type="button" className={secondaryButtonStyles} onClick={onSecondButtonClick}>
              {secondButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PopUpDialog;
