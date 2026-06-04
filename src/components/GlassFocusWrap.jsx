import { useLongHover } from "../hooks/useLongHover";
import FocusPortal from "./FocusPortal";

function GlassFocusWrap({
  title,
  children,
  focusChildren,
  className = "",
  focusClassName = "",
}) {
  const {
    containerRef,
    isHovering,
    progress,
    focused,
    closeFocus,
    interactionHandlers,
  } = useLongHover();

  const classes = [
    "glass-focus-wrap",
    "glass-hoverable",
    "focus-expandable",
    className,
    isHovering ? "is-holding" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        ref={containerRef}
        className={classes}
        style={{ "--hold-progress": `${progress}%` }}
        role="button"
        tabIndex={0}
        aria-label={`${title}. Clic o mantener 5 segundos para ampliar`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            interactionHandlers.onClick(event);
          }
        }}
        {...interactionHandlers}
      >
        {isHovering && !focused && (
          <span className="hold-indicator" aria-hidden="true">
            Clic o mantén 5s para ampliar
          </span>
        )}
        {children}
      </div>

      {focused && (
        <FocusPortal title={title} onClose={closeFocus}>
          <div className={`focus-enlarged ${focusClassName}`.trim()}>
            {focusChildren ?? children}
          </div>
        </FocusPortal>
      )}
    </>
  );
}

export default GlassFocusWrap;
