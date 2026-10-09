import "./SearchInput.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  ariaLabel = "Search",
  disabled = false,
}: SearchInputProps) => {
  return (
    <div className="search-input-container">
      <span className="search-input-icon" aria-hidden="true">
        🔍
      </span>

      <input
        type="search"
        className="search-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
      />

      {value && !disabled && (
        <button
          type="button"
          className="search-input-clear"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchInput;