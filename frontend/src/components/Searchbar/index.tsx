import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { IOptions, Select } from '../Select';

interface ISearchbarProps {
    options?: IOptions[];
    filter?: Record<string, any>;
    setFilter?: (filters: Record<string, any>) => void;
    allowMultiple?: boolean;
}

export function Searchbar({
    options = [],
    filter = {},
    setFilter,
    allowMultiple = false,
}: ISearchbarProps) {
    const [field, setField] = useState('');
    const [text, setText] = useState('');

    const handleSearch = () => {
        if (field && text && setFilter) {
            if (allowMultiple) {
                setFilter({
                    ...filter,
                    [field]: text,
                });
            } else {
                setFilter({
                    [field]: text,
                });
            }
        }
    };

    const handleClearFilter = (fieldToClear: string) => {
        if (setFilter) {
            const newFilters = { ...filter };
            delete newFilters[fieldToClear];
            setFilter(newFilters);
        }
    };

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-row shadow-md">
                <div className="w-48">
                    <Select
                        addClassName="rounded-l-md"
                        placeholder="Pesquisa por"
                        options={options}
                        value={field}
                        onChange={event => setField(event.target.value)}
                    />
                </div>
                <Input
                    type="text"
                    placeholder="Digite o termo da pesquisa..."
                    className="h-13 border-t border-b border-solid border-gray-300 flex-1 block w-full p-3 text-gray-700 bg-white appearance-none focus:outline-none focus:bg-gray-100 focus:shadow-inner"
                    value={text}
                    onChange={event => setText(event.target.value)}
                />
                <Button
                    className="h-13 w-16 md:w-32 flex flex-row space-x-3 font-light items-center justify-center px-4 py-2 rounded-r-md tracking-wide"
                    iconName="FaSearch"
                    pattern="action"
                    type="button"
                    onClick={handleSearch}
                >
                    Pesquisar
                </Button>
            </div>
            {allowMultiple && Object.keys(filter).length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(filter).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                        >
                            <span className="text-sm text-gray-700">
                                {options.find(opt => opt.key === key)?.text}:{' '}
                                {value}
                            </span>
                            <button
                                onClick={() => handleClearFilter(key)}
                                className="ml-2 text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
