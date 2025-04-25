import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useCallback, useState } from 'react';
import { Link } from '../../components/Link';
import { api } from '../../services/api';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { showNotification } from '../../utils/notification';
import { Form } from '../../components/Form';
import { FormLabel } from '../../components/Form/components/FormLabel';
import { Checkbox } from '../../components/Checkbox';
import { CheckboxContainer } from '../../components/CheckboxContainer';
import { cnpjMask } from '../../utils/cnpj';

const newUserSchema = yup
    .object({
        name: yup.string().required('Nome obrigatório'),
        email: yup
            .string()
            .email('E-mail inválido')
            .required('E-mail é obrigatório'),
        emailConfirm: yup
            .string()
            .email('E-mail inválido')
            .equals([yup.ref('email'), null], 'Os e-mails devem corresponder')
            .required('Confirmação de e-mail é obrigatório'),
        password: yup
            .string()
            .min(6, 'Minimo de 6 caracteres')
            .required('Senha obrigatória'),
        passwordConfirm: yup
            .string()
            .equals([yup.ref('password'), null], 'As senhas devem corresponder')
            .required('Confirmação de senha é obrigatória'),
        nameCompany: yup.string().required('Nome da empresa é obrigatório'),
        federalCode: yup
            .string()
            .required('Código é obrigatório.')
            .min(14, 'O CNPJ deve ser exatamente 14 digitos')
            .max(18, 'O CNPJ deve ser exatamente 14 digitos'),
        city: yup.string().required('Cidade da empresa é obrigatório'),
        state: yup.string().required('Estado da empresa é obrigatório'),
        type: yup
            .mixed()
            .required('Selecione uma opção')
            .oneOf(['T', 'E'], 'Opção inválida'),
    })
    .required();

interface IFormProps {
    name: string;
    email: string;
    emailConfirm: string;
    password: string;
    passwordConfirm: string;
    nameCompany: string;
    city: string;
    federalCode: string;
    state: string;
    type: 'T' | 'E';
}

export default function Register() {
    const { register, handleSubmit, formState, setValue, getValues } =
        useForm<IFormProps>({
            resolver: yupResolver(newUserSchema),
        });

    const [sent, setSent] = useState(false);

    const handleCreateUser: SubmitHandler<IFormProps> = useCallback(
        async data => {
            if (data) {
                try {
                    setSent(true);

                    const dataFormated = {
                        name: data.name,
                        email: data.email,
                        emailConfirm: data.emailConfirm,
                        password: data.password,
                        passwordConfirm: data.passwordConfirm,
                        company: {
                            name: data.nameCompany,
                            city: data.city,
                            federalCode: data.federalCode,
                            state: data.state,
                            isTransporter: data.type === 'T',
                            isSender: data.type === 'E',
                        },
                    };
                    await api.post('/users/newuser-company', dataFormated);
                } catch (error) {
                    showNotification({
                        message: `${error.response.data.message}`,
                    });
                    setSent(false);
                }
            }
        },
        [],
    );

    if (sent) {
        return (
            <div className="h-screen w-screen bg-slate-700 flex justify-center items-center">
                <div className="bg-white rounded p-5 w-full max-w-[80%] md:max-w-[40%] flex flex-col items-center">
                    <Link
                        className="inline-block right-0 align-baseline text-sm text-500 text-gray-500 hover:text-red-400 hover:font-bold"
                        href="/"
                    >
                        Voltar para login
                    </Link>

                    <span className="my-10 text-center">
                        Seu cadastro esta sendo processado e logo você receberá
                        as instruções para acesso no e-mail{' '}
                        <b>{getValues('email')}</b>.
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="font-sans bg-slate-700 text-gray-50 flex flex-col justify-center items-center min-h-screen py-5 space-y-2">
            <span className="font-medium text-center text-lg md:font-bold">
                Cadastrar Usuário
            </span>
            <Form
                onSubmit={handleSubmit(handleCreateUser)}
                className="grid md:grid-cols-2 md:gap-x-5 gap-y-2 pb-3 p-8 bg-white rounded shadow-xl"
            >
                <FormLabel className="md:col-span-2 mt-5 font-semibold text-black">
                    Dados do usuário administrador
                </FormLabel>
                <Input
                    type="text"
                    label="Nome"
                    labelClassName="md:col-span-2"
                    className="
                                        h-12
                                        border
                                        border-solid
                                        rounded-md
                                        border-gray-300
                                        flex-1
                                        block
                                        w-full
                                        p-3
                                        text-gray-700
                                        bg-white
                                        appearance-none
                                        focus:outline-none
                                        shadow-md
                                        focus:shadow-blue-200
                                    "
                    placeholder="Digite o seu nome completo"
                    error={formState.errors.name}
                    {...register('name', {
                        required: true,
                    })}
                />
                <Input
                    type="email"
                    label="E-mail"
                    placeholder="Digite o seu email"
                    error={formState.errors.email}
                    {...register('email', {
                        required: true,
                    })}
                />
                <Input
                    type="email"
                    label="Confirmar E-mail"
                    placeholder="Confirme seu email"
                    error={formState.errors.emailConfirm}
                    {...register('emailConfirm', {
                        required: true,
                    })}
                />
                <Input
                    type="password"
                    label="Senha"
                    placeholder="Digite a sua senha"
                    error={formState.errors.password}
                    {...register('password', {
                        required: true,
                    })}
                />
                <Input
                    type="password"
                    label="Confirmar Senha"
                    placeholder="Confirme sua senha"
                    error={formState.errors.passwordConfirm}
                    {...register('passwordConfirm', {
                        required: true,
                    })}
                />
                <FormLabel className="md:col-span-2 mt-5 font-semibold text-black">
                    Empresa
                </FormLabel>
                <Input
                    type="text"
                    label="Nome"
                    labelClassName="md:col-span-2"
                    placeholder="Digite o nome da empresa"
                    error={formState.errors.nameCompany}
                    {...register('nameCompany', {
                        required: true,
                    })}
                />

                <Input
                    type="text"
                    label="CNPJ"
                    placeholder="Digite o CNPJ"
                    error={formState.errors.federalCode}
                    {...register('federalCode', {
                        required: true,
                    })}
                    onFocus={() =>
                        setValue(
                            'federalCode',
                            getValues('federalCode')
                                ?.replaceAll('.', '')
                                .replaceAll(' ', '')
                                .replaceAll('/', '')
                                .replaceAll('-', ''),
                        )
                    }
                    onBlur={() =>
                        setValue(
                            'federalCode',
                            cnpjMask(getValues('federalCode')),
                        )
                    }
                />
                <Input
                    type="text"
                    label="Cidade"
                    placeholder="Digite a cidade da empresa"
                    error={formState.errors.city}
                    {...register('city', {
                        required: true,
                    })}
                />

                <Input
                    type="text"
                    label="Estado"
                    placeholder="Digite o estado da empresa"
                    error={formState.errors.state}
                    {...register('state', {
                        required: true,
                    })}
                />

                <CheckboxContainer
                    label="Tipo da Empresa"
                    error={formState.errors.type}
                >
                    <Checkbox
                        label="Transportador"
                        name="type"
                        {...register('type')}
                        type="radio"
                        value="T"
                    />
                    <Checkbox
                        label="Embarcador"
                        name="type"
                        {...register('type')}
                        type="radio"
                        value="E"
                    />
                </CheckboxContainer>

                <div className="col-span-full py-5 items-center flex justify-between">
                    <Button
                        type="submit"
                        isLoading={formState.isSubmitting}
                        iconClass="md:hidden"
                        iconName="FaArrowRight"
                        pattern="confirm"
                    >
                        Cadastrar
                    </Button>
                    <Link
                        className="inline-block right-0 align-baseline text-sm text-500 text-gray-500 hover:text-red-400 hover:font-bold"
                        href="/"
                    >
                        Já possui uma conta?
                    </Link>
                </div>
            </Form>
        </div>
    );
}
Register.hasLayout = false;
