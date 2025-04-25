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

const baseRoute = '/documents';
export default function Documents() {
    const [files, setFiles] = useState<FormData>();
    const [filters, setFilters] = useState({});
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
            legend:
                item.status in legends ? legends[item.status] : 'text-black',
            dateDelivery: item.dateDelivery
                ? new Date(item.dateDelivery).toLocaleString()
                : '',
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
                            options={[
                                {
                                    value: 'number',
                                    text: 'Número da Nota',
                                    key: 'number',
                                },
                                {
                                    value: 'nfekey',
                                    text: 'Número da Chave',
                                    key: 'nfekey',
                                },
                                {
                                    value: 'codeTrip',
                                    text: 'Número da Viagem',
                                    key: 'codeTrip',
                                },
                            ]}
                        />
                        <div className="h-full overflow-hidden flex flex-col space-y-4">
                            <Buttonbar namePage="Nota Fiscal">
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
                                {
                                    title: 'Status',
                                    name: 'statusTxt',
                                    legend: true,
                                },
                                { title: 'Número', name: 'docSerie' },
                                {
                                    title: 'Data de Entrega',
                                    name: 'dateDelivery',
                                },
                                { title: 'Cliente', name: 'customerName' },
                                {
                                    title: 'Transportadora',
                                    name: 'transporterName',
                                },
                                { title: 'Tipo do frete', name: 'typeFreight' },
                                { title: 'Remetente', name: 'senderName' },
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
