import { Search, X } from "lucide-react";
import { useState } from "react";

export const SearchBar = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [value, setValue] = useState("");
  const update = (v: string) => {
    setValue(v);
    onSearch(v);
  };
  return (
    <div className="search-wrapper">
      <Search size={15} className="search-wrapper__icon" />
      <input type="text" placeholder="Search protocols, ICF…" value={value} onChange={(e) => update(e.target.value)} aria-label="Search protocols and ICFs" />
      {value && (
        <button className="search-wrapper__clear" onClick={() => update("")} aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </div>
  );
};
