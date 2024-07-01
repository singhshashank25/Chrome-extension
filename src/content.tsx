import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Modal from "~features/Modal";
import cssText from "data-text:~style.css";
import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"]
};

export const getStyle = () => {
  const style = document.createElement("style");
  style.textContent = cssText;
  return style;
};

const ContentScript = () => {
  const [showIcon, setShowIcon] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const messageInputRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const blurTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    console.log("ContentScript useEffect running");

    const handleFocus = (event: FocusEvent) => {
      console.log("Input focused");
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      if (event.target === messageInputRef.current) {
        setShowIcon(true);
        console.log("showIcon set to true");
      }
    };

    const handleBlur = (event: FocusEvent) => {
      if (event.relatedTarget === buttonRef.current) {
        console.log("Blur event ignored due to button click");
        return;
      }
      console.log("Input blurred");
      blurTimeoutRef.current = window.setTimeout(() => {
        setShowIcon(false);
        console.log("showIcon set to false");
      }, 1000);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        const messageInput = document.querySelector('.msg-form__contenteditable') as HTMLDivElement;
        if (messageInput && !messageInputRef.current) {
          console.log("Message input found", messageInput);
          messageInputRef.current = messageInput;
          messageInput.addEventListener("focus", handleFocus);
          messageInput.addEventListener("blur", handleBlur);
          observer.disconnect();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      if (messageInputRef.current) {
        messageInputRef.current.removeEventListener("focus", handleFocus);
        messageInputRef.current.removeEventListener("blur", handleBlur);
      }
      observer.disconnect();
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleIconClick = () => {
    console.log("Icon clicked");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal");
    setShowModal(false);
    setShowIcon(true); // Ensure AI button shows again if needed
  };

  const handleInsert = (text: string) => {
    console.log("Inserting generated text into input field");
    const messageInput = document.querySelector(".msg-form__contenteditable") as HTMLDivElement;
    if (messageInput) {
      messageInput.innerText = text;
    }
    setShowModal(false);
    setShowIcon(true); // Ensure AI button shows again if needed
  };

  return (
    <>
      {showIcon && console.log("Rendering AI button")}
      {showIcon &&
        messageInputRef.current &&
        createPortal(
          <div className="absolute top-0 right-0 mt-2 mr-2 z-50" ref={buttonRef}>
            <button
              onClick={handleIconClick}
              className="p-2 bg-blue-500 text-white rounded-full shadow-lg"
            >
              AI
            </button>
          </div>,
          messageInputRef.current
        )}
      {showModal && console.log("Rendering Modal")}
      {showModal &&
        createPortal(
          <Modal onClose={handleCloseModal} onInsert={handleInsert} />,
          document.body
        )}
    </>
  );
};

export default ContentScript;
