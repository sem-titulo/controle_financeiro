import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { ContentBody } from '../../../components/Content';
import { Form } from '../../../components/Form';
import { FormLabel } from '../../../components/Form/components/FormLabel';
import { Input } from '../../../components/Input';
import { api } from '../../../services/api';
import { Buttonbar } from '../../../components/Buttonbar';
import { Button } from '../../../components/Button';
import { showNotification } from '../../../utils/notification';
import { Select } from '../../../components/Select';
import { ocos } from '../../../lib/ocos';
/* Defina seus campos aqui */
interface IFormProps {
    code: string;
    description: string;
    action: string;
    isApproved: number;
    isActive: number;
    depara: string;
}
/* Defina seus campos aqui */
const schema = yup.object({
    code: yup.string().required('Código é obrigatório.'),
    description: yup.string().required('Descrição é obrigatória.'),
    action: yup.string().required('Ação é obrigatória.'),
    isApproved: yup.number(),
    isActive: yup.number(),
    depara: yup.string(),
});
/* Defina a base da rota principal */
const baseRoute = '/occurrences';

export default function FormOccurrences() {
    const router = useRouter();
    const id = router.query?.id;
    const [mode, setMode] = useState<'read' | 'insert' | 'edit' | 'remove'>(
        id === 'new' ? 'insert' : 'read',
    );
    const { handleSubmit, register, formState, reset } = useForm<IFormProps>({
        resolver: yupResolver(schema),
        defaultValues: {
            code: undefined,
            description: undefined,
            action: '',
            isApproved: 0,
            isActive: 1,
            depara: '',
        },
    });

    const handleSave: SubmitHandler<IFormProps> = useCallback(
        async submitData => {
            setMode('read');
            if (submitData) {
                const data = {
                    ...submitData,
                    isApproved: submitData.isApproved === 1,
                    isActive: submitData.isActive === 1,
                };
                try {
                    if (mode === 'insert') {
                        const response = await api.post(baseRoute, data);
                        router.replace(`${baseRoute}/form/${response.data.id}`);
                    } else if (mode === 'edit') {
                        const updateData = {
                            ...data,
                            id,
                        };
                        await api.patch(`${baseRoute}/${id}`, updateData);
                    } else if (mode === 'remove') {
                        await api.delete(`${baseRoute}/${id}`);
                        router.push(baseRoute);
                    }
                } catch (error) {
                    if (id === 'new') {
                        showNotification({
                            message: `Erro ao criar ocorrência.\n${error.response.data.message}`,
                        });
                    } else {
                        showNotification({
                            // eslint-disable-next-line prettier/prettier
                            message: `Erro ao ${
                                mode === 'edit' ? 'editar' : 'remover'
                            } ocorrência.\n${error.response.data.message}`,
                        });
                    }
                }
            }
        },
        [id, mode, router],
    );

    useEffect(() => {
        if (id && id !== 'new') {
            api.get(`${baseRoute}/${id}`).then(response => {
                reset({
                    code: response.data.code,
                    description: response.data.description,
                    action: response.data.action,
                    isApproved: response.data.isApproved ? 1 : 0,
                    isActive: response.data.isActive ? 1 : 0,
                    depara: response.data.depara,
                });
            });
        }
    }, [id, reset]);

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
                        onClick={() => setMode('remove')}
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
                <FormLabel>Ocorrência</FormLabel>
                <Input
                    label="Código"
                    name="code"
                    type="text"
                    error={formState.errors.code}
                    {...register('code')}
                    readOnly={mode !== 'insert'}
                    autoFocus
                />
                <Input
                    label="Descrição"
                    name="description"
                    type="text"
                    error={formState.errors.description}
                    {...register('description')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    label="Ação"
                    placeholder="Selecione uma opção"
                    error={formState.errors.action}
                    {...register('action')}
                    options={[
                        { value: '0', text: 'Informativa', key: '0' },
                        { value: '1', text: 'Início de Transporte', key: '1' },
                        { value: '2', text: 'Registrar Entrega', key: '2' },
                        { value: '3', text: 'Devolução', key: '3' },
                        { value: '4', text: 'Reentrega', key: '4' },
                        { value: '9', text: 'Cancelamento', key: '9' },
                    ]}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    label="Aprovação Automática"
                    key="isApproved"
                    error={formState.errors.isApproved}
                    {...register('isApproved', {
                        required: true,
                    })}
                    options={[
                        {
                            value: 1,
                            text: 'Sim',
                            key: 'yes',
                        },
                        {
                            value: 0,
                            text: 'Não',
                            key: 'no',
                        },
                    ]}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    label="Ativo"
                    key="isActive"
                    error={formState.errors.isActive}
                    {...register('isActive', {
                        required: true,
                    })}
                    options={[
                        {
                            value: 1,
                            text: 'Sim',
                            key: 'yes',
                        },
                        {
                            value: 0,
                            text: 'Não',
                            key: 'no',
                        },
                    ]}
                    readOnly={mode === 'insert' || mode !== 'edit'}
                />
                <Select
                    label="De Para Docs"
                    key="depara"
                    error={formState.errors.depara}
                    {...register('depara', {
                        required: true,
                    })}
                    options={ocos}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
            </Form>
        </ContentBody>
    );
}
