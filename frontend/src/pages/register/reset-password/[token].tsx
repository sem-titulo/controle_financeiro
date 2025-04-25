import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Link } from '../../../components/Link';
import { Loading } from '../../../components/Loading';
import { api } from '../../../services/api';

interface IFormProps {
    password: string;
    passwordConfirm: string;
}

const schema = yup
    .object({
        password: yup
            .string()
            .min(6, 'Minimo de 6 caracteres')
            .required('Senha obrigatória'),
        passwordConfirm: yup
            .string()
            .equals([yup.ref('password'), null], 'As senhas devem corresponder')
            .required('Confirmação de senha é obrigatória'),
    })
    .required();

function ResetPassword() {
    const router = useRouter();
    const token = router.query?.token;
    const [sent, setSent] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState } = useForm<IFormProps>({
        resolver: yupResolver(schema),
    });

    const handleSendForm: SubmitHandler<IFormProps> = async data => {
        setLoading(true);
        api.post(`/login/reset-password/${token}`, data)
            .then(() => {
                setSent('Nova senha validada com sucesso!');
            })
            .catch(error => {
                setSent(error.response.data.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (loading) {
        return <Loading />;
    }

    if (sent) {
        return (
            <div className="h-screen font-sans ForgotPassword bg-slate-700">
                <div className="container mx-auto h-full flex flex-1 justify-center items-center">
                    <div>
                        <div className="leading-loose">
                            <h1 className="font-medium text-center text-lg md:font-bold text-gray-50">
                                Recuperando senha
                            </h1>
                            <div className="flex flex-col m-4 p-8 space-y-4 bg-white rounded shadow-xl">
                                <span className="text-justify">{sent}</span>
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
                <title>Docs - Redefinição de senha</title>
            </Head>
            <div className="h-screen font-sans ForgotPassword bg-slate-700">
                <div className="container mx-auto h-full flex flex-1 justify-center items-center">
                    <div className="w-full max-w-lg">
                        <div className="leading-loose">
                            <h1 className="font-medium text-center text-lg md:font-bold text-gray-50">
                                Redefinição de senha
                            </h1>
                            <form
                                onSubmit={handleSubmit(handleSendForm)}
                                className="m-4 p-8 space-y-4 bg-white rounded shadow-xl"
                            >
                                <div>
                                    <Input
                                        name="password"
                                        type="password"
                                        label="Senha"
                                        placeholder="Digite a nova senha"
                                        error={formState.errors.password}
                                        {...register('password', {
                                            required: true,
                                        })}
                                    />
                                    <Input
                                        name="passwordConfirm"
                                        type="password"
                                        label="Confirmação de senha"
                                        placeholder="Digite a confirmação da nova senha"
                                        error={formState.errors.passwordConfirm}
                                        {...register('passwordConfirm', {
                                            required: true,
                                        })}
                                    />
                                </div>

                                <div className="mt-4 items-center flex justify-between">
                                    <Button
                                        type="submit"
                                        isLoading={formState.isSubmitting}
                                        pattern="confirm"
                                    >
                                        Recuperar
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ResetPassword.hasLayout = false;

export default ResetPassword;
