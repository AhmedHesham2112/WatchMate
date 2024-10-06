import { useRef } from "react";

function Search({ query, setQuery, results, handleResultClick }) {
  const inputEl = useRef(null);

  return (
    <input
      className="input w-full rounded-lg border border-gray-300 p-2 text-black"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

export default Search;
