import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { IOptions, Select } from '../Select';

interface ISearchbarProps {
    options?: IOptions[];
    setFilter?: (key) => void;
}

export function Searchbar({ options = [], setFilter }: ISearchbarProps) {
    const [field, setField] = useState('');
    const [text, setText] = useState('');

    return (
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
                onClick={() => setFilter({ field, text })}
            >
                Pesquisar
            </Button>
        </div>
    );
}
