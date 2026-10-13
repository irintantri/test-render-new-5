export const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-wrapper">
      <input 
        type="text" 
        placeholder="Search protocols, ICF…" 
        onChange={(e) => onSearch(e.target.value)} 
      />
      {/* Search icon asset */}
    </div>
  );
};