import Head from 'next/head';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Link } from '../../../components/Link';
import { api } from '../../../services/api';
import { Loading } from '../../../components/Loading';
import { showNotification } from '../../../utils/notification';

const schema = yup
    .object({
        email: yup
            .string()
            .required('E-mail obrigatório')
            .email('E-mail inválido'),
    })
    .required();

interface IFormProps {
    email: string;
}

export default function ForgotPassword() {
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState } = useForm<IFormProps>({
        resolver: yupResolver(schema),
    });

    const handleSendForm: SubmitHandler<IFormProps> = async data => {
        setLoading(true);
        api.post('/login/forgot-password', {
            email: data.email,
        })
            .catch(error => {
                showNotification({
                    message: error.response.data.message,
                    type: 'error',
                });
            })
            .finally(() => {
                setLoading(false);
                setSent(true);
            });
    };

    if (loading) {
        return <Loading />;
    }

    if (sent) {
        return (
            <div className="h-screen font-sans ForgotPassword bg-slate-700">
                <div className="container mx-auto h-full flex flex-1 justify-center items-center">
                    <div className="w-full xl:max-w-[50%]">
                        <div className="leading-loose">
                            <h1 className="font-medium text-center text-lg md:font-bold text-gray-50">
                                Recuperando senha
                            </h1>
                            <div className="flex flex-col m-4 p-8 space-y-4 bg-white rounded shadow-xl">
                                <span className="text-justify">
                                    Caso exista o e-mail cadastrado, você
                                    receberá as credenciais para recuparação da
                                    senha.
                                </span>
                                <Link
                                    className="inline-block right-0 align-baseline text-sm text-500 text-gray-500 hover:text-red-400 hover:font-bold"
                                    href="/"
                                >
                                    Voltar para login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Docs - Esqueci minha senha</title>
            </Head>
            <div className="h-screen font-sans ForgotPassword bg-slate-700">
                <div className="container mx-auto h-full flex flex-1 justify-center items-center">
                    <div className="w-full max-w-lg">
                        <div className="leading-loose">
                            <h1 className="font-medium text-center text-lg md:font-bold text-gray-50">
                                Esqueci minha senha
                            </h1>
                            <form
                                onSubmit={handleSubmit(handleSendForm)}
                                className="m-4 p-8 space-y-4 bg-white rounded shadow-xl"
                            >
                                <div>
                                    <Input
                                        name="email"
                                        type="email"
                                        label="E-mail"
                                        placeholder="Digite o seu email"
                                        error={formState.errors.email}
                                        {...register('email', {
                                            required: true,
                                        })}
                                    />
                                </div>

                                <div className="mt-4 items-center flex justify-between">
                                    <Button
                                        type="submit"
                                        isLoading={formState.isSubmitting}
                                        iconClass="md:hidden"
                                        iconName="FaArrowRight"
                                        pattern="confirm"
                                    >
                                        Recuperar
                                    </Button>
                                    <Link
                                        className="inline-block right-0 align-baseline text-sm text-500 text-gray-500 hover:text-red-400 hover:font-bold"
                                        href="/"
                                    >
                                        Lembrou a senha?
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ForgotPassword.hasLayout = false;
