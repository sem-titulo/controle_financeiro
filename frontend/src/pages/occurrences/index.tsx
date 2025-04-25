import React, { useCallback, useState } from 'react';
import { Button } from '../../components/Button';
import { Buttonbar } from '../../components/Buttonbar';
import { ContentBody } from '../../components/Content';
import { Loading } from '../../components/Loading';
// import { Searchbar } from '../../components/Searchbar';
import { Table } from '../../components/Table';

const baseRoute = '/occurrences';

const ACTION = {
    '0': 'Informativa',
    '1': 'Início de Transporte',
    '2': 'Registrar Entrega',
    '3': 'Devolução',
    '4': 'Reentrega',
    '9': 'Cancelamento',
};

export default function Ocurrences() {
    const [loading, setLoading] = useState(false);

    const handleBeforeLoad = useCallback(() => setLoading(true), []);
    const handleAfterLoad = useCallback(() => setLoading(false), []);

    const formatData = useCallback(data => {
        return data.map(item => ({
            ...item,
            action: ACTION[item.action],
            isApproved: item.isApproved ? 'Sim' : 'Não',
        }));
    }, []);

    return (
        <>
            <ContentBody>
                <div className="flex-1 w-full overflow-y-hidden px-3 py-2 text-black">
                    <div className="h-full overflow-hidden flex flex-col space-y-4">
                        {/* <Searchbar /> */}
                        <Buttonbar namePage="Ocorrências">
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
                                { title: 'Código', name: 'code' },
                                { title: 'Descrição', name: 'description' },
                                { title: 'Ação', name: 'action' },
                                {
                                    title: 'Aprov.Automática',
                                    name: 'isApproved',
                                },
                            ]}
                        />
                    </div>
                </div>
            </ContentBody>
            {loading ? <Loading /> : null}
        </>
    );
}
