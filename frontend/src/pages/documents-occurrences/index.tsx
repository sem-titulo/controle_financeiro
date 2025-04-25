import React, { useCallback, useState } from 'react';
import { Button } from '../../components/Button';
import { Buttonbar } from '../../components/Buttonbar';
import { ContentBody } from '../../components/Content';
import { DragDrop } from '../../components/DragDrop';
import { Loading } from '../../components/Loading';
import { Table } from '../../components/Table';
import { api } from '../../services/api';
import { showNotification } from '../../utils/notification';

const baseRoute = '/documents-occurrences';

const legends = {
    '0': 'text-blue-500',
    '1': 'text-green-500',
    '2': 'text-red-500',
};

export default function DocumentsOccurrences() {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<FormData>();
    const [isNewOrderModalIfOpen, setisNewOrderModalIfOpen] = useState(false);

    const handleOpenNewOrder = useCallback(() => {
        setisNewOrderModalIfOpen(true);
    }, []);

    const handleCloseNewOrder = useCallback(() => {
        setisNewOrderModalIfOpen(false);
    }, []);

    const handleSendFile = async () => {
        try {
            if (files && files.getAll('files').length > 0) {
                api.post(`${baseRoute}/import/edi`, files)
                    .then(() => {
                        showNotification({
                            type: 'success',
                            message: 'Arquivo enviado com sucesso!',
                        });
                    })
                    .catch(error => {
                        showNotification({
                            type: 'error',
                            message: error.response.data.message,
                        });
                    });
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

    const handleBeforeLoad = useCallback(() => setLoading(true), []);
    const handleAfterLoad = useCallback(() => setLoading(false), []);

    const formatData = useCallback(data => {
        return data.map(item => ({
            ...item,
            number: item.number.toString().padStart(6, '0'),
            legend:
                item.statusCode in legends
                    ? legends[item.statusCode]
                    : 'text-black',
            dateOccurrence: new Date(item.dateOccurrence).toLocaleString(),
        }));
    }, []);

    return (
        <>
            <ContentBody>
                <div className="flex-1 w-full overflow-y-hidden px-3 py-2 text-black">
                    <div className="h-full overflow-hidden flex flex-col space-y-4">
                        {/* <Searchbar /> */}
                        <Buttonbar namePage="Lançamento de Ocorrências">
                            <Button
                                iconName="FaPaperclip"
                                pattern="confirm"
                                onClick={handleOpenNewOrder}
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
                        <Table
                            route={baseRoute}
                            formatData={formatData}
                            afterLoad={handleAfterLoad}
                            beforeLoad={handleBeforeLoad}
                            fields={[
                                {
                                    title: 'Status',
                                    name: 'statusTxt',
                                    legend: true,
                                },
                                {
                                    title: 'Num.Ocorrência',
                                    name: 'number',
                                },
                                {
                                    title: 'Nota Fiscal',
                                    name: 'documentNumberSerie',
                                },
                                {
                                    title: 'Ocorrência',
                                    name: 'occurrenceCodeDesc',
                                },
                                {
                                    title: 'Transportadora',
                                    name: 'nameTransporter',
                                },
                                {
                                    title: 'Dt.Ocorrência',
                                    name: 'dateOccurrence',
                                },
                            ]}
                        />
                    </div>
                </div>
            </ContentBody>
            {isNewOrderModalIfOpen ? (
                <DragDrop
                    handleCloseModal={handleCloseNewOrder}
                    handleSubmitModal={handleSendFile}
                    setFiles={setFiles}
                />
            ) : null}
            {loading ? <Loading /> : null}
        </>
    );
}
