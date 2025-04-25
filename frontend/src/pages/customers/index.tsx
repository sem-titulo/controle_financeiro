import React, { useCallback, useState } from 'react';
import { Button } from '../../components/Button';
import { Buttonbar } from '../../components/Buttonbar';
import { ContentBody } from '../../components/Content';
import { Loading } from '../../components/Loading';
// import { Searchbar } from '../../components/Searchbar';
import { Table } from '../../components/Table';

const baseRoute = '/customers';

export default function Customers() {
    const [loading, setLoading] = useState(false);

    const handleBeforeLoad = useCallback(() => setLoading(true), []);
    const handleAfterLoad = useCallback(() => setLoading(false), []);

    return (
        <>
            <ContentBody>
                <div className="flex-1 w-full overflow-y-hidden px-3 py-2 text-black">
                    <div className="h-full overflow-hidden flex flex-col space-y-4">
                        {/* <Searchbar /> */}
                        <Buttonbar namePage="Clientes">
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
                            afterLoad={handleAfterLoad}
                            beforeLoad={handleBeforeLoad}
                            fields={[
                                { title: 'Código', name: 'code' },
                                { title: 'Nome', name: 'name' },
                                { title: 'Cidade', name: 'city' },
                                { title: 'Estado', name: 'state' },
                            ]}
                        />
                    </div>
                </div>
            </ContentBody>
            {loading ? <Loading /> : null}
        </>
    );
}
