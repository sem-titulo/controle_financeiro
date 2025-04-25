import Head from 'next/head';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Link } from '../components/Link';
import { useAuth } from '../contexts/AuthContext';
import logo from '../../public/logo.png';

const loginSchema = yup
    .object({
        email: yup
            .string()
            .required('E-mail obrigatório')
            .email('E-mail inválido'),
        senha: yup
            .string()
            .min(6, 'Mínimo de 6 caracteres')
            .required('Senha obrigatória'),
    })
    .required();

interface IFormProps {
    email: string;
    senha: string;
}

export default function Login() {
    const { signIn } = useAuth();
    const { register, handleSubmit, formState } = useForm<IFormProps>({
        resolver: yupResolver(loginSchema),
    });

    const handleSignIn: SubmitHandler<IFormProps> = async data => {
        await signIn(data);
    };

    return (
        <>
            <Head>
                <title>Docs - Login</title>
            </Head>
            <div className="h-screen font-sans login bg-slate-700">
                <div className="container mx-auto h-full flex flex-1 justify-center items-center">
                    <div className="w-full max-w-lg">
                        <div className="leading-loose">
                            <form
                                onSubmit={handleSubmit(handleSignIn)}
                                className="m-4 p-8 space-y-4 bg-white rounded shadow-xl"
                            >
                                <div className="flex justify-center items-center ">
                                    <div className="w-[50%]">
                                        <Image
                                            src={logo}
                                            alt="Docs - A melhor solução logística"
                                        />
                                    </div>
                                </div>
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
                                <div>
                                    <Input
                                        name="senha"
                                        type="password"
                                        label="Senha"
                                        placeholder="Digite a sua senha"
                                        error={formState.errors.senha}
                                        {...register('senha', {
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
                                        Entrar
                                    </Button>
                                    <Link
                                        className="inline-block right-0 align-baseline text-sm text-500 text-gray-500 hover:text-red-400 hover:font-bold"
                                        href="/register/forgot-password"
                                    >
                                        Esqueceu a senha?
                                    </Link>
                                </div>
                                <div className="text-center">
                                    <Link
                                        className="inline-block right-0 align-baseline text-sm text-500 text-gray-500 hover:text-red-400 hover:font-bold"
                                        href="/register"
                                    >
                                        Criar uma conta
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

Login.hasLayout = false;
