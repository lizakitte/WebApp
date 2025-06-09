import { PropsWithChildren, useEffect } from "react";
import "../styles/formStyle.css";

type ModalProps = {
  style: React.CSSProperties;
  setStyle: React.Dispatch<React.SetStateAction<React.CSSProperties>>;
  onClose?: () => void;
};

function Modal({
  onClose,
  children,
  style,
  setStyle,
}: PropsWithChildren<ModalProps>) {
  useEffect(() => {
    if (!style.display) {
      setStyle({ display: "none" });
    }
  }, [setStyle]);

  return (
    <>
      <div className="backdrop" style={style}>
        <div className="modal">
          <div className="modal-content">
            <span
              className="close"
              onClick={() => {
                setStyle({ display: "none" });
                onClose?.();
              }}
            >
              &times;
            </span>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
