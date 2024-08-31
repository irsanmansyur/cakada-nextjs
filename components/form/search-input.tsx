import { useEffect, useState, ChangeEvent } from "react";

interface SearchInputProps {
  textLength?: number;
  onChange?: (text: string) => void;
}

export default function SearchInput({
  textLength = 1,
  onChange = (text) => text,
}: SearchInputProps) {
  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue, setDebouncedValue] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
      onChange(inputValue);
    }, 500); // Wait 500 milliseconds after the user stops typing

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, onChange]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  return (
    <input
      placeholder="Search"
      value={inputValue}
      onChange={handleInputChange}
      className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
    />
  );
}
