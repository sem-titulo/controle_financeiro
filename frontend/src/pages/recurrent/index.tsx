import { useCallback, useState } from 'react';
import { ContentBody } from '../../components/Content';
import { Table } from '../../components/Table';
import { Buttonbar } from '../../components/Buttonbar';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import { api } from '../../services/api';
import { showNotification } from '../../utils/notification';

/* Defina a base da rota principal */
const baseRoute = '/recurrent';

export default function Recurrent() {
    const [loading, setLoading] = useState(false);

    const handleBeforeLoad = useCallback(() => setLoading(true), []);
    const handleAfterLoad = useCallback(() => setLoading(false), []);

    const handleGerarBalance = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.post(`${baseRoute}/gerar-balance`);
            showNotification({ message: response.data.mensagem });
        } catch (error: any) {
            showNotification({
                message: `Erro ao gerar balanço.\n${
                    error?.response?.data?.error || error.message
                }`,
                type: 'error',
            });
        } finally {
            setLoading(false);
        }
    }, []);

    const formatData = useCallback(data => {
        return data.map(item => ({
            ...item,
            valor: item.valor?.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }),
        }));
    }, []);

    return (
        <>
            <ContentBody>
                <div className="flex-1 w-full overflow-y-hidden px-3 py-2 text-black">
                    <div className="h-full overflow-hidden flex flex-col space-y-4">
                        <Buttonbar namePage="Transações Recorrentes">
                            <Button
                                onClick={handleGerarBalance}
                                iconName="FaSync"
                                pattern="confirm"
                            >
                                Gerar Balanço
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
                                { title: 'Descrição', name: 'descricao' },
                                { title: 'Valor', name: 'valor' },
                                { title: 'Tipo', name: 'tipo' },
                                { title: 'Dia', name: 'dia' },
                                { title: 'Categoria', name: 'categoria' },
                                { title: 'Tag', name: 'tag' },
                            ]}
                        />
                    </div>
                </div>
            </ContentBody>
            {loading ? <Loading /> : null}
        </>
    );
}
