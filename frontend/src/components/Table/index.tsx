/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-array-index-key */
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { FaCircle } from 'react-icons/fa';
import { api } from '../../services/api';
import { showNotification } from '../../utils/notification';

interface IField {
    name: string;
    title: string;
    legend?: boolean;
}

interface IFilterProps {
    field?: string;
    text?: string;
}

interface ITableProps {
    route?: string;
    fields?: IField[];
    reload?: boolean;
    filter?: IFilterProps;
    formatData?: (data) => IField[];
    afterLoad?: () => void;
    beforeLoad?: () => void;
}

function renderColumns(line, fields: IField[]) {
    return fields.map(field => (
        <td
            key={`${line.id}-${field.name}`}
            className="px-6 py-4 flex-row items-center justify-center whitespace-nowrap"
        >
            {field.legend ? (
                <div className="inline-block pr-2">
                    <FaCircle className={`${line.legend}`} />
                </div>
            ) : null}
            <span className="inline-block">{line[field.name]}</span>
        </td>
    ));
}

function renderLine(lines, fields: IField[], route: string) {
    return lines.map((item, index) => {
        return (
            <tr
                key={`${item.id}-${index}`}
                onClick={() => Router.push(`${route}/form/${item.id}`)}
                className={`
                            ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            text-black border-b cursor-pointer hover:bg-gray-100 transition-colors duration-200`}
            >
                {renderColumns(item, fields)}
            </tr>
        );
    });
}

export function Table({
    route,
    fields,
    reload = false,
    filter,
    formatData,
    afterLoad,
    beforeLoad,
}: ITableProps) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (route) {
            if (beforeLoad) {
                beforeLoad();
            }

            api.get(route, {
                params: filter,
            })
                .then(response => {
                    if (formatData) setData(formatData(response.data));
                    else setData(response.data);
                })
                .catch(error =>
                    showNotification({
                        message: `Erro na busca dos dados no table ${error.message}`,
                    }),
                )
                .finally(() => {
                    if (afterLoad) {
                        afterLoad();
                    }
                });
        }
    }, [route, reload, filter, formatData, afterLoad, beforeLoad]);

    if (!data) {
        return <>Carregando</>;
    }

    return (
        <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                    <div className="overflow-hidden border-b sm:rounded-lg border border-gray-300 shadow-md">
                        <table className="min-w-full divide-y divide-gray-300  tracking-wider">
                            <thead className="bg-gray-100">
                                <tr
                                    key={`${route}_table_titles`}
                                    className="text-left"
                                >
                                    {/* <th /> */}
                                    {fields.map(({ title, name }) => (
                                        <th
                                            key={name}
                                            className="px-6 py-4 whitespace-nowrap"
                                        >
                                            {title}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300 text-sm">
                                {renderLine(data, fields, route)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
