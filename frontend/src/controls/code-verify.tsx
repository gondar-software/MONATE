import React, { useRef, useState } from "react";

export const CodeVerify = (props: any) => {
  const length = props.length | 6;
  const [code, setCode] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (value: string, index: number) => {
    if (value.match(/^[0-9a-zA-Z]{0,1}$/)) {
      const updatedCode = [...code];
      updatedCode[index] = value;
      setCode(updatedCode);

      if (value && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }

      if (updatedCode.every((char) => char !== "")) {
        props.onComplete(updatedCode.join(""));
        setCode(Array(length).fill(""));
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    const updatedCode = pasteData.split("").map((char, idx) => (idx < length ? char : code[idx]));

    setCode(updatedCode);
    inputsRef.current[Math.min(pasteData.length, length) - 1]?.focus();

    if (updatedCode.every((char) => char !== "")) {
      props.onComplete(updatedCode.join(""));
      setCode(Array(length).fill(""));
    }
  };

  return (
    <form className="max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
      <div className="flex mb-2 space-x-2 rtl:space-x-reverse">
        {code.map((value, index) => (
          <div key={index}>
            <label htmlFor={`code-${index + 1}`} className="sr-only">
              Code Input {index + 1}
            </label>
            <input
              id={`code-${index + 1}`}
              type="text"
              maxLength={1}
              value={value}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={(e) => handlePaste(e)}
              className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>
        ))}
      </div>
    </form>
  );
};

export default CodeVerify;