import "./FilterSelect.css";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

const FilterSelect = ({
  value,
  options,
  onChange,
  placeholder = "All",
  ariaLabel = "Filter items",
  disabled = false,
}: FilterSelectProps) => {
  return (
    <div className="filter-select-container">
      <label className="filter-select-label">
        <span className="filter-select-label-text">
          {ariaLabel}
        </span>

        <select
          className="filter-select"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-label={ariaLabel}
        >
          <option value="">{placeholder}</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default FilterSelect;