import SearchIcon from '@/shared/assets/icons/search.svg';
import DeleteIcon from '@/shared/assets/icons/delete.svg';

interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function SearchField({ value, onChange, placeholder = '검색어를 입력하세요' }: SearchFieldProps) {
  const showClear = value.length > 0;

  return (
    <div className="w-full px-5 mt-4" role="search" aria-label="검색">
      <div className="flex items-center h-10 gap-2 px-4 py-2 rounded-lg bg-gray-100 border border-transparent focus-within:border-gray-300 transition-colors">
        <label className="flex items-center gap-2 flex-1  cursor-text">
          <span className="sr-only">{placeholder}</span>
          <img src={SearchIcon} alt="" aria-hidden className="w-4 h-4" />

          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
          />
        </label>

        {showClear && (
          <button
            type="button"
            onClick={() => onChange('')}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            className="flex items-center justify-center"
            aria-label="검색어 삭제"
          >
            <img src={DeleteIcon} alt="" aria-hidden className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchField;
