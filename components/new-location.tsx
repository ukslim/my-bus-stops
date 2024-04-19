import { useRouter } from "next/router";
import { useState } from "react";

export const NewLocation = () => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/loc/${inputValue}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter location ID:
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="mt-1 p-2 border rounded-md w-full"
        />
      </label>
      <input
        type="submit"
        value="Go to location"
        className="p-2 bg-blue-500 text-white rounded-md cursor-pointer"
      />
    </form>
  );
};
