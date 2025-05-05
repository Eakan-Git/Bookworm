import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface Option {
    name: string;
    value: string;
}

interface SelectGroupProps {
    header: string;
    options: Option[];
    onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
    className?: string;
    defaultOpen?: boolean;
    selectedValue?: string;
}

function SelectGroup({
    header,
    options,
    onClick,
    className,
    defaultOpen = true,
    selectedValue
}: SelectGroupProps) {
    const { t } = useTranslation("shop");
    const groupId = `select-group-${header.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className={`collapse collapse-arrow border border-base-content/20 rounded-sm ${className || ''}`}>
            <input type="checkbox" defaultChecked={defaultOpen} />
            <div className="collapse-title text-lg font-bold px-4 py-2">
                {header}
            </div>
            <div className="collapse-content px-4 pt-0 gap-2 overflow-y-auto max-h-64">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center w-full rounded-sm justify-start gap-2 hover:cursor-pointer py-1"
                    >
                        <input
                            id={`${groupId}-${option.value}`}
                            name={groupId}
                            type="radio"
                            value={option.value}
                            checked={selectedValue === option.value}
                            className="radio radio-sm flex-shrink-0"
                            onChange={() => {}} // Required to avoid React warning about controlled component
                            onClick={onClick}
                        />
                        <span className="truncate text-sm">{option.name}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(SelectGroup);