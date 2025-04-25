import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Link } from '../../../components/Link';
import { Loading } from '../../../components/Loading';
import { api } from '../../../services/api';

function Confirmation() {
    const router = useRouter();
    const token = router.query?.token;
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('Acesso confirmado com sucesso.');

    useEffect(() => {
        if (token) {
            api.post(`/login/confirmation/${token}`)
                .catch(error => {
                    setMessage(error.response.data.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [token]);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="h-screen w-screen bg-slate-700 flex justify-center items-center">
            <div className="bg-white rounded p-5 w-full max-w-[80%] md:max-w-[40%] flex flex-col items-center">
                <Link
                    className="inline-block right-0 align-baseline text-sm text-500 text-gray-500 hover:text-red-400 hover:font-bold"
                    href="/"
                >
                    Voltar para login
                </Link>

                <span className="my-10 text-center">{message}</span>
            </div>
        </div>
    );
}

Confirmation.hasLayout = false;

export default Confirmation;
