import { useCallback, useState } from 'react';
import { ContentBody } from '../../components/Content';
import { Table } from '../../components/Table';
// import { Searchbar } from '../../components/Searchbar';
import { Buttonbar } from '../../components/Buttonbar';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';

/* Defina a base da rota principal */
const baseRoute = '/company';

export default function Company() {
    const [loading, setLoading] = useState(false);

    const handleBeforeLoad = useCallback(() => setLoading(true), []);
    const handleAfterLoad = useCallback(() => setLoading(false), []);

    return (
        <>
            <ContentBody>
                <div className="flex-1 w-full overflow-y-hidden px-3 py-2 text-black">
                    <div className="h-full overflow-hidden flex flex-col space-y-4">
                        {/* <Searchbar /> */}
                        <div className="h-full overflow-hidden flex flex-col space-y-4">
                            <Buttonbar namePage="Empresas">
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
                            afterLoad={handleAfterLoad}
                            beforeLoad={handleBeforeLoad}
                            fields={[
                                { title: 'Código', name: 'code' },
                                { title: 'Nome', name: 'name' },
                            ]}
                        />
                    </div>
                </div>
            </ContentBody>
            {loading ? <Loading /> : null}
        </>
    );
}
