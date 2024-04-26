import { useRouter } from "next/router";
import type React from "react";
import { useState } from "react";

export const NewLocation: React.FC = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/loc/${inputValue}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <label>Enter location ID:</label>
      <div className="flex w-full mt-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="p-2 border rounded-md flex-grow"
        />
        <input
          type="submit"
          value="Go to location"
          className="p-2 bg-blue-500 text-white rounded-md cursor-pointer ml-2"
        />
      </div>
    </form>
  );
};
