import { useRouter, withRouter } from 'next/router';
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
import { TextArea } from '../../../components/TextArea';

/* Defina seus campos aqui */
interface IFormProps {
    documentId: string;
    occurrenceId: string;
    transporterId: string;
    dateOccurrence: string;
    observation: string;
    status: string;
}
/* Defina seus campos aqui */
const schema = yup.object({
    documentId: yup.string().required('Nota fiscal é obrigatória.'),
    occurrenceId: yup.string().required('Ocorrência é obrigatória.'),
    transporterId: yup.string().required('Transportadora é obrigatória.'),
    dateOccurrence: yup.string().required('Data da Ocorrência é obrigatória.'),
});
/* Defina a base da rota principal */
const baseRoute = '/documents-occurrences';

function FormDocumentsOccurrences() {
    const router = useRouter();
    const id = router.query?.id;
    const documentId = router.query?.documentId as string;
    const transporterId = router.query?.transporterId as string;

    const [mode, setMode] = useState<
        | 'read'
        | 'insert'
        | 'edit'
        | 'remove'
        | 'reverse'
        | 'approved'
        | 'reject'
    >(id === 'new' ? 'insert' : 'read');
    const { handleSubmit, register, formState, reset, watch } =
        useForm<IFormProps>({
            resolver: yupResolver(schema),
            defaultValues: {
                dateOccurrence: `${new Date()
                    .toISOString()
                    .substring(0, 16)}:00`,
            },
        });
    const [documents, setDocuments] = useState([]);
    const [occurrences, setOccurrences] = useState([]);
    const [transporters, setTransporters] = useState([]);
    const status = watch('status');

    const handleSave: SubmitHandler<IFormProps> = async data => {
        if (data) {
            try {
                if (mode === 'insert') {
                    await api.post(`${baseRoute}/${data.documentId}`, data);
                } else if (mode === 'edit') {
                    const updateData = {
                        ...data,
                        id,
                    };
                    await api.patch(`${baseRoute}/${id}`, updateData);
                } else if (mode === 'remove') {
                    await api.delete(`${baseRoute}/${id}`);
                } else if (mode === 'reverse') {
                    await api.patch(`${baseRoute}/${id}/action`, {
                        action: 'E',
                    });
                } else if (mode === 'approved') {
                    await api.patch(`${baseRoute}/${id}/action`, {
                        action: 'A',
                    });
                } else if (mode === 'reject') {
                    await api.patch(`${baseRoute}/${id}/action`, {
                        action: 'R',
                    });
                }
                router.back();
            } catch (error) {
                if (id === 'new') {
                    showNotification({
                        message: `Erro ao lançar ocorrência.\n${error.response.data.message}`,
                    });
                } else {
                    showNotification({
                        // eslint-disable-next-line prettier/prettier
                        message: `Erro ao ${mode === 'edit' ? 'lançar' : 'remover lançamento da'
                            // eslint-disable-next-line prettier/prettier
                            } ocorrência.\n${error.response.data.message}`,
                    });
                }
            }
        }
    };

    const handleApprove = useCallback(() => {
        setMode('approved');
    }, []);

    const handleReject = useCallback(() => {
        setMode('reject');
    }, []);

    const handleReverse = useCallback(() => {
        setMode('reverse');
    }, []);

    const handleEdit = useCallback(() => {
        setMode('edit');
    }, []);

    const handleRemove = useCallback(() => {
        setMode('remove');
    }, []);

    useEffect(() => {
        // Carregando cadastros necessários para abertura da tela
        const allPromises = Promise.all([
            api.get('/documents', {
                params: {
                    field: 'status',
                    text: '2',
                    operator: 'not',
                },
            }),
            api.get('/occurrences'),
            api.get('/transporters'),
        ]);

        allPromises.then(([r1, r2, r3]) => {
            let dataFormatted = [];

            // Buscando notas fiscais
            if (r1.data.length > 0) {
                r1.data.map(data => {
                    return dataFormatted.push({
                        text: data.docSerie,
                        key: data.id,
                        value: data.id,
                    });
                });
            }

            setDocuments(dataFormatted);

            // Buscando cadastros de ocorrências
            dataFormatted = [];
            if (r2.data.length > 0) {
                r2.data.map(data => {
                    return dataFormatted.push({
                        text: `${data.code} - ${data.description}`,
                        key: data.id,
                        value: data.id,
                    });
                });
            }

            setOccurrences(dataFormatted);

            // Buscando transportadores
            dataFormatted = [];
            if (r3.data.length > 0) {
                r3.data.map(data => {
                    return dataFormatted.push({
                        text: data.name,
                        key: data.id,
                        value: data.id,
                    });
                });
            }

            setTransporters(dataFormatted);

            // Agora que todos cadastros foram carregados, podemos buscar os dados da ocorrência da tela
            if (id && id !== 'new') {
                api.get(`${baseRoute}/${id}`).then(response => {
                    reset({
                        documentId: response.data.documentId,
                        occurrenceId: response.data.occurrenceId,
                        transporterId: response.data.transporterId,
                        dateOccurrence: response.data.dateOccurrence.substring(
                            0,
                            16,
                        ),
                        observation: response.data.observation,
                        status: response.data.status,
                    });
                });
            } else if (documentId) {
                reset({
                    documentId,
                    transporterId,
                });
            }
        });
    }, [documentId, id, reset, transporterId]);

    return (
        <ContentBody>
            <Form onSubmit={handleSubmit(handleSave)}>
                <Buttonbar isForm>
                    <Button
                        onClick={handleApprove}
                        isLoading={formState.isSubmitting}
                        iconName="FaClipboardCheck"
                        hidden={mode !== 'read' || status !== '0'}
                    >
                        Aprovar
                    </Button>

                    <Button
                        onClick={handleReject}
                        isLoading={formState.isSubmitting}
                        iconName="FaEraser"
                        hidden={mode !== 'read' || status !== '0'}
                    >
                        Rejeitar
                    </Button>

                    <Button
                        onClick={handleReverse}
                        isLoading={formState.isSubmitting}
                        iconName="FaMinusCircle"
                        hidden={
                            mode !== 'read' ||
                            (status !== '1' && status !== '2')
                        }
                    >
                        Estornar
                    </Button>

                    <Button
                        onClick={handleEdit}
                        isLoading={formState.isSubmitting}
                        iconName="FaEdit"
                        hidden={mode !== 'read' || status !== '0'}
                        pattern="confirm"
                    >
                        Editar
                    </Button>

                    <Button
                        onClick={handleRemove}
                        isLoading={formState.isSubmitting}
                        iconName="FaTrash"
                        hidden={mode !== 'read' || status !== '0'}
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
                            mode !== 'remove' &&
                            mode !== 'reverse' &&
                            mode !== 'approved' &&
                            mode !== 'reject'
                        }
                        pattern="confirm"
                    >
                        Salvar
                    </Button>

                    <Button
                        onClick={() => {
                            if (mode === 'insert' || mode === 'read') {
                                router.back();
                            } else {
                                setMode('read');
                                reset();
                            }
                        }}
                        iconName="FaReply"
                    >
                        Cancelar
                    </Button>
                </Buttonbar>
                <FormLabel>Lançamento de Ocorrências</FormLabel>

                <Select
                    label="Nota fiscal"
                    placeholder="Escolher"
                    {...register('documentId')}
                    error={formState.errors.documentId}
                    options={documents}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    label="Ocorrência"
                    placeholder="Escolher"
                    {...register('occurrenceId')}
                    error={formState.errors.occurrenceId}
                    options={occurrences}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    label="Transportadora"
                    placeholder="Escolher"
                    {...register('transporterId')}
                    error={formState.errors.transporterId}
                    options={transporters}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Data"
                    name="dateOccurrence"
                    type="datetime-local"
                    error={formState.errors.dateOccurrence}
                    {...register('dateOccurrence')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Status"
                    name="status"
                    type="text"
                    labelClassName="hidden"
                    error={formState.errors.status}
                    {...register('status')}
                    readOnly
                />
                <TextArea
                    label="Observação"
                    name="observation"
                    labelClassName="md:col-span-3"
                    className="
                        h-24
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
                    error={formState.errors.observation}
                    {...register('observation')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
            </Form>
        </ContentBody>
    );
}

export default withRouter(FormDocumentsOccurrences);
