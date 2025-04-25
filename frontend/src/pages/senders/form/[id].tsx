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

/* Defina seus campos aqui */
interface IFormProps {
    code: string;
    name: string;
    city: string;
    state: string;
}
/* Defina seus campos aqui */
const schema = yup.object({
    code: yup.string().required('Código é obrigatório.'),
    name: yup.string().required('Nome é obrigatório.'),
    city: yup.string().required('Cidade é obrigatória.'),
    state: yup.string().required('Estado é obrigatório.'),
});
/* Defina a base da rota principal */
const baseRoute = '/senders';

export default function FormSenders() {
    const router = useRouter();
    const id = router.query?.id;
    const [mode, setMode] = useState<'read' | 'insert' | 'edit' | 'remove'>(
        id === 'new' ? 'insert' : 'read',
    );
    const { handleSubmit, register, formState, reset } = useForm({
        resolver: yupResolver(schema),
    });

    const handleSave: SubmitHandler<IFormProps> = async data => {
        if (data) {
            try {
                if (mode === 'insert') {
                    await api.post(baseRoute, data);
                } else if (mode === 'edit') {
                    const updateData = {
                        ...data,
                        id,
                    };
                    await api.patch(`${baseRoute}/${id}`, updateData);
                } else if (mode === 'remove') {
                    await api.delete(`${baseRoute}/${id}`);
                }
                router.push(baseRoute);
            } catch (error) {
                if (id === 'new') {
                    showNotification({
                        message: `Erro ao criar remetente.\n${error.response.data.message}`,
                    });
                } else {
                    showNotification({
                        message: `Erro ao ${
                            mode === 'edit' ? 'editar' : 'remover'
                        } remetente.\n${error.response.data.message}`,
                    });
                }
            }
        }
    };

    useEffect(() => {
        if (id && id !== 'new') {
            api.get(`${baseRoute}/${id}`).then(response => {
                reset({
                    code: response.data.code,
                    name: response.data.name,
                    city: response.data.city,
                    state: response.data.state,
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
                // eslint-disable-next-line prettier/prettier
                message: `Erro ao ${mode === 'edit' ? 'editar' : 'remover'
                    // eslint-disable-next-line prettier/prettier
                    } empresa.\n${error.response.data.message}`,
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
                <FormLabel>Remetente</FormLabel>
                <Input
                    label="Código"
                    name="code"
                    type="text"
                    error={formState.errors.code}
                    {...register('code', {
                        required: true,
                    })}
                    readOnly={mode !== 'insert'}
                />
                <Input
                    label="Nome"
                    name="name"
                    type="text"
                    error={formState.errors.name}
                    {...register('name', {
                        required: true,
                    })}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Cidade"
                    name="city"
                    type="text"
                    error={formState.errors.city}
                    {...register('city', {
                        required: true,
                    })}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Estado"
                    name="state"
                    type="text"
                    error={formState.errors.state}
                    {...register('state', {
                        required: true,
                    })}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
            </Form>
        </ContentBody>
    );
}
