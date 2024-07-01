import { FC, useEffect, useRef, useState } from "react";

interface ModalProps {
  onClose: () => void;
  onInsert: (text: string) => void;
}

const Modal: FC<ModalProps> = ({ onClose, onInsert }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [userInput, setUserInput] = useState<string>("");
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleGenerate = () => {
    const generatedMessage =
      "\nThank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.";
    setGeneratedText(generatedMessage);
  };

  const handleInsert = () => {
    if (generatedText) {
      onInsert(generatedText);
      onClose();
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md" ref={modalRef}>
        <div className="mb-4">
          {!generatedText ? (
            <>
              <label htmlFor="userInput" className="block text-sm font-medium text-gray-700">
                Enter your command:
              </label>
              <input
                type="text"
                id="userInput"
                value={userInput}
                onChange={handleChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Type your command here..."
              />
            </>
          ) : (
            <p className="text-lg font-semibold text-gray-800">{generatedText}</p>
          )}
        </div>
        <div className="mb-4">
          {!generatedText ? (
            <button
              onClick={handleGenerate}
              className="mr-2 px-4 py-2 bg-blue-500 text-white rounded shadow"
            >
              Generate
            </button>
          ) : (
            <>
              <button
                onClick={handleInsert}
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded shadow"
              >
                Regenerte
              </button>
              <button
                onClick={handleInsert}
                className="px-4 py-2 bg-gray-300 text-gray-600 rounded shadow"
              >
                Insert
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-600 rounded shadow"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
