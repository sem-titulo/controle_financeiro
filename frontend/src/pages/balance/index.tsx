import React, { useCallback, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { Button } from '../../components/Button';
import { ContentBody } from '../../components/Content';
import { DragDrop } from '../../components/DragDrop';
import { Table } from '../../components/Table';
import { api } from '../../services/api';
import { Searchbar } from '../../components/Searchbar';
import { Buttonbar } from '../../components/Buttonbar';
import { showNotification } from '../../utils/notification';
import { Loading } from '../../components/Loading';

interface IFormProps {
    file_xml: string;
}

const legends = {
    '0': 'text-blue-500',
    '1': ' text-yellow-500',
    '2': 'text-green-500',
    '3': 'text-gray-500',
    '4': 'text-orange-500',
    '9': 'text-red-500',
};

const baseRoute = '/balance';
export default function Balance() {
    const [files, setFiles] = useState<FormData>();
    const [filters, setFilters] = useState({
        tipo: 'Saída'
    });
    const [loading, setLoading] = useState(false);

    const [isNewOrderModalIfOpen, setisNewOrderModalIfOpen] = useState(false);

    const handleOpenNewOrder = useCallback(() => {
        setisNewOrderModalIfOpen(true);
    }, []);

    const handleCloseNewOrder = useCallback(() => {
        setisNewOrderModalIfOpen(false);
    }, []);

    const handleCreateInvoice: SubmitHandler<IFormProps> = async () => {
        try {
            if (files.getAll('files').length > 0) {
                await api.post(`${baseRoute}/importall-xml`, files);
            } else {
                showNotification({
                    message: 'Nenhum arquivo selecionado para envio.',
                    type: 'error',
                });
            }
        } catch (error) {
            showNotification({
                message: error.response.data.message,
                type: 'error',
            });
        }

        handleCloseNewOrder();
    };

    const formatData = useCallback(data => {
        return data.map(item => ({
            ...item,
            valor: item.valor?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }),
        }));
    }, []);

    const handleBeforeLoad = useCallback(() => setLoading(true), []);
    const handleAfterLoad = useCallback(() => setLoading(false), []);
    const handleFilters = useCallback(data => setFilters(data), []);

    return (
        <>
            <ContentBody>
                <div className="flex-1 w-full overflow-y-hidden px-3 py-2 text-black">
                    <div className="h-full overflow-hidden flex flex-col space-y-4">
                        <Searchbar
                            setFilter={handleFilters}
                            filter={filters}
                            options={[
                                {
                                    value: 'mes',
                                    text: 'Mês',
                                    key: 'mes',
                                },
                                {
                                    value: 'ano',
                                    text: 'Ano',
                                    key: 'ano',
                                },
                                {
                                    value: 'tipo',
                                    text: 'Tipo',
                                    key: 'tipo',
                                },
                                {
                                    value: 'categoria',
                                    text: 'Categoria',
                                    key: 'categoria',
                                },
                                {
                                    value: 'tag',
                                    text: 'Tag',
                                    key: 'tag',
                                },
                            ]}
                        />
                        <div className="h-full overflow-hidden flex flex-col space-y-4">
                            <Buttonbar namePage="Despesas">
                                <Button
                                    // className="h-12 w-16 md:w-32 bg-green-800 flex flex-row space-x-3 font-light hover:bg-green-900 items-center justify-center px-4 py-2 mr-2 text-gray-50 rounded-md tracking-wide"
                                    iconName="FaPaperclip"
                                    onClick={handleOpenNewOrder}
                                    pattern="confirm"
                                >
                                    Importar
                                </Button>

                                <Button
                                    href={`${baseRoute}/form/new`}
                                    iconName="FaPlus"
                                    pattern="confirm"
                                >
                                    Incluir
                                </Button>
                            </Buttonbar>
                        </div>
                        <Table
                            route={baseRoute}
                            reload={isNewOrderModalIfOpen}
                            filter={filters}
                            formatData={formatData}
                            afterLoad={handleAfterLoad}
                            beforeLoad={handleBeforeLoad}
                            fields={[
                                { title: 'Fonte', name: 'fonte' },
                                { title: 'Valor', name: 'valor' },
                                { title: 'Mês', name: 'mes' },
                                { title: 'Tag', name: 'tag' },
                                // { title: 'Tipo', name: 'tipo' },
                                { title: 'Categoria', name: 'categoria' },
                                { title: 'Ano', name: 'ano' },
                            ]}
                        />
                    </div>
                </div>
            </ContentBody>
            {isNewOrderModalIfOpen ? (
                <DragDrop
                    handleCloseModal={handleCloseNewOrder}
                    handleSubmitModal={handleCreateInvoice}
                    setFiles={setFiles}
                />
            ) : null}
            {loading ? <Loading /> : null}
        </>
    );
}
