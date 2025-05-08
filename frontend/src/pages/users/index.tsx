import React, { useCallback, useState } from 'react';
import { Button } from '../../components/Button';
import { Buttonbar } from '../../components/Buttonbar';
import { ContentBody } from '../../components/Content';
import { Loading } from '../../components/Loading';
// import { Searchbar } from '../../components/Searchbar';
import { Table } from '../../components/Table';

const baseRoute = '/users';

export default function User() {
    const [loading, setLoading] = useState(false);

    const handleBeforeLoad = useCallback(() => setLoading(true), []);
    const handleAfterLoad = useCallback(() => setLoading(false), []);

    const formatData = useCallback(data => {
        return data.map(item => ({
            ...item,
            ativo: item.ativo === true ? 'Ativo' : 'Desativado',
            admin: item.admin === true ? 'Ativo' : 'Desativado',
            criado_em: item.criado_em
                ? new Date(item.criado_em).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                  })
                : '',
        }));
    }, []);

    return (
        <>
            <ContentBody>
                <div className="flex-1 w-full overflow-y-hidden px-3 py-2 text-black">
                    <div className="h-full overflow-hidden flex flex-col space-y-4">
                        {/* <Searchbar /> */}
                        <Buttonbar namePage="Usuários">
                            <Button
                                href={`${baseRoute}/form/new`}
                                iconName="FaPlus"
                                pattern="confirm"
                            >
                                Incluir
                            </Button>
                        </Buttonbar>
                        <Table
                            route={`${baseRoute}`}
                            formatData={formatData}
                            afterLoad={handleAfterLoad}
                            beforeLoad={handleBeforeLoad}
                            fields={[
                                { title: 'Nome', name: 'nome' },
                                { title: 'E-mail', name: 'email' },
                                { title: 'Ativo', name: 'ativo' },
                                { title: 'Administrador', name: 'admin' },
                                { title: 'Data de Criação', name: 'criado_em' },
                            ]}
                        />
                    </div>
                </div>
            </ContentBody>
            {loading ? <Loading /> : null}
        </>
    );
}
