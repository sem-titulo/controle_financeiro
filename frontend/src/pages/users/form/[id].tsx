import Router, { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { ContentBody } from '../../../components/Content';
import { Form } from '../../../components/Form';
import { FormLabel } from '../../../components/Form/components/FormLabel';
import { Input } from '../../../components/Input';
import { api } from '../../../services/api';
import { Buttonbar } from '../../../components/Buttonbar';
import { Button } from '../../../components/Button';
import { showNotification } from '../../../utils/notification';
import { Select } from '../../../components/Select';

/* Esquema de validação */
const schema = yup.object({
    nome: yup.string().required('Nome é obrigatório.'),
    email: yup.string().required('E-mail é obrigatório.'),
    admin: yup.number().required(),
    ativo: yup.number().required(),
    senha: yup.string(),
});

/* Campos permitidos */
interface IUser {
    nome: string;
    email: string;
    ativo: number;
    admin: number;
    senha: string;
}

/* Rota base */
const baseRoute = '/users';

export default function FormUser() {
    const router = useRouter();
    const id = router.query?.id;
    const [mode, setMode] = useState<'read' | 'insert' | 'edit' | 'remove'>(
        id === 'new' ? 'insert' : 'read',
    );

    const {
        handleSubmit,
        register,
        formState,
        reset,
    } = useForm<IUser>({
        resolver: yupResolver(schema),
    });

    const handleSave: SubmitHandler<IUser> = async submitData => {
        const data = {
            ...submitData,
            admin: submitData.admin === 1,
            ativo: submitData.ativo === 1,
        };

        try {
            if (mode === 'insert') {
                await api.post(`${baseRoute}/`, data);
            } else if (mode === 'edit') {
                await api.put(`${baseRoute}/${id}`, { ...data, id });
            } else if (mode === 'remove') {
                await api.delete(`${baseRoute}/${id}`);
            }

            router.push(baseRoute);
        } catch (error) {
            showNotification({
                message: `Erro ao salvar usuário.\n${error.response?.data?.message || ''}`,
            });
        }
    };

    useEffect(() => {
        if (id && id !== 'new') {
            api.get(`${baseRoute}/${id}`).then(response => {
                reset({
                    nome: response.data.nome,
                    email: response.data.email,
                    admin: response.data.admin ? 1 : 0,
                    ativo: response.data.ativo ? 1 : 0,
                });
            });
        }
    }, [id, reset]);

    async function remove() {
        try {
            await api.delete(`${baseRoute}/${id}`);
            setMode('remove');
            Router.push(baseRoute);
        } catch (error) {
            showNotification({
                message: `Erro ao remover usuário.\n${error.response?.data?.message || ''}`,
            });
        }
    }

    return (
        <ContentBody>
            <Form onSubmit={handleSubmit(handleSave)}>
                <Buttonbar isForm>
                    <Button
                        onClick={() => setMode('edit')}
                        isLoading={formState.isSubmitting}
                        iconName="FaEdit"
                        hidden={mode !== 'read'}
                        pattern="confirm"
                    >
                        Editar
                    </Button>

                    <Button
                        onClick={() => remove()}
                        isLoading={formState.isSubmitting}
                        iconName="FaTrash"
                        hidden={mode !== 'read'}
                        pattern="revert"
                    >
                        Remover
                    </Button>

                    <Button
                        type="submit"
                        isLoading={formState.isSubmitting}
                        iconName="FaCheck"
                        hidden={
                            mode !== 'edit' &&
                            mode !== 'insert' &&
                            mode !== 'remove'
                        }
                        pattern="confirm"
                    >
                        Salvar
                    </Button>

                    <Button
                        href={
                            mode === 'edit' || mode === 'remove'
                                ? null
                                : baseRoute
                        }
                        onClick={() => {
                            setMode('read');
                            reset();
                        }}
                        iconName="FaReply"
                    >
                        Cancelar
                    </Button>
                </Buttonbar>

                <FormLabel>Usuário</FormLabel>
                <Input
                    label="Nome"
                    name="nome"
                    type="text"
                    error={formState.errors.nome}
                    {...register('nome')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="E-mail"
                    name="email"
                    type="text"
                    error={formState.errors.email}
                    {...register('email')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />

                <label className="w-full">
                    <span className="block text-md text-gray-600 mt-2 mb-1">
                        Ativo
                    </span>
                    <Select
                        key="ativo"
                        error={formState.errors.ativo}
                        {...register('ativo', { required: true })}
                        placeholder="Selecione"
                        options={[
                            { value: 1, text: 'Sim', key: 'yes' },
                            { value: 0, text: 'Não', key: 'no' },
                        ]}
                        readOnly={mode !== 'edit' && mode !== 'insert'}
                    />
                </label>

                <label className="w-full">
                    <span className="block text-md text-gray-600 mt-2 mb-1">
                        Administrador
                    </span>
                    <Select
                        key="admin"
                        error={formState.errors.admin}
                        {...register('admin', { required: true })}
                        placeholder="Selecione"
                        options={[
                            { value: 1, text: 'Sim', key: 'yes' },
                            { value: 0, text: 'Não', key: 'no' },
                        ]}
                        readOnly={mode !== 'edit' && mode !== 'insert'}
                    />
                </label>

                <FormLabel>Dados de acesso</FormLabel>
                <Input
                    label="Senha"
                    name="senha"
                    type="senha"
                    error={formState.errors.senha}
                    {...register('senha')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
            </Form>
        </ContentBody>
    );
}
