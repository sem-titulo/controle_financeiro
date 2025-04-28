import Router, { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '../../../services/api';
import { showNotification } from '../../../utils/notification';
import { Button } from '../../../components/Button';
import { Buttonbar } from '../../../components/Buttonbar';
import { ContentBody } from '../../../components/Content';
import { Form } from '../../../components/Form';
import { FormLabel } from '../../../components/Form/components/FormLabel';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { TextArea } from '../../../components/TextArea';

/* Defina a base da rota principal */
const baseRoute = '/recurrent';

type IMode = 'read' | 'insert' | 'edit' | 'remove';

interface IFormProps {
    descricao: string;
    valor: number;
    tipo: 'Entrada' | 'Saída';
    categoria?: string;
    tag?: string;
    dia: number;
    inicio?: string;
    fim?: string;
}

/* Schema de validação */
const schema = yup.object({
    descricao: yup.string().required('Descrição é obrigatória.'),
    valor: yup
        .number()
        .required('Valor é obrigatório.')
        .typeError('Valor deve ser numérico.'),
    tipo: yup
        .string()
        .oneOf(['Entrada', 'Saída'])
        .required('Tipo é obrigatório.'),
    categoria: yup.string().nullable(),
    tag: yup.string().nullable(),
    dia: yup.number().required('Dia é obrigatório.').min(1).max(31),
    inicio: yup
        .string()
        .nullable()
        .transform((value, originalValue) => {
            if (!originalValue) return null;
            if (originalValue.includes('/')) {
                const [day, month, year] = originalValue.split('/');
                return `${year}-${month}-${day}`;
            }
            return originalValue;
        })
        .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            'Data inválida (formato esperado: yyyy-mm-dd)',
        ),
    fim: yup
        .string()
        .nullable()
        .transform((value, originalValue) => {
            if (!originalValue) return null;
            if (originalValue.includes('/')) {
                const [day, month, year] = originalValue.split('/');
                return `${year}-${month}-${day}`;
            }
            return originalValue;
        })
        .matches(
            /^\d{4}-\d{2}-\d{2}$/,
            'Data inválida (formato esperado: yyyy-mm-dd)',
        ),
});

export default function RecurrentForm() {
    const router = useRouter();
    const id = router.query?.id;
    const [mode, setMode] = useState<IMode>(id === 'new' ? 'insert' : 'read');
    const [loading, setLoading] = useState(true);

    const { handleSubmit, register, formState, reset } = useForm<IFormProps>({
        resolver: yupResolver(schema),
    });

    const loadData = useCallback(() => {
        if (id && id !== 'new') {
            api.get(`${baseRoute}/${id}`).then(response => {
                reset(response.data);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [id, reset]);

    useEffect(() => {
        loadData();
    }, [id, loadData]);

    const handleSave: SubmitHandler<IFormProps> = async submitData => {
        try {
            if (id === 'new') {
                await api.post(`${baseRoute}`, submitData);
            } else {
                await api.put(`${baseRoute}/${id}`, submitData);
            }
            Router.push('/recurrent');
        } catch (error: any) {
            showNotification({
                message: `${error?.response?.data?.error || error.message}`,
            });
        }
    };

    async function remove() {
        try {
            await api.delete(`${baseRoute}/${id}`);
            Router.push(baseRoute);
        } catch (error: any) {
            showNotification({
                message: `Erro ao remover transação.\n${
                    error?.response?.data?.error || error.message
                }`,
            });
        }
    }

    return (
        <ContentBody loading={loading}>
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
                        onClick={remove}
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
                        hidden={mode !== 'edit' && mode !== 'insert'}
                        pattern="confirm"
                    >
                        Salvar
                    </Button>

                    <Button
                        href={mode === 'insert' ? baseRoute : null}
                        onClick={() => {
                            setMode('read');
                            loadData();
                        }}
                        iconName="FaReply"
                    >
                        Cancelar
                    </Button>
                </Buttonbar>

                <FormLabel>Transação Recorrente</FormLabel>

                <Input
                    label="Descrição"
                    {...register('descricao')}
                    error={formState.errors.descricao}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Valor"
                    type="number"
                    {...register('valor')}
                    error={formState.errors.valor}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    label="Tipo"
                    {...register('tipo')}
                    error={formState.errors.tipo}
                    options={[
                        { value: 'Entrada', text: 'Entrada', key: 'entrada' },
                        { value: 'Saída', text: 'Saída', key: 'saida' },
                    ]}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    label="Categoria"
                    {...register('categoria')}
                    options={[
                        {
                            value: 'Alimentação',
                            text: 'Alimentação',
                            key: 'Alimentação',
                        },
                        {
                            value: 'Transporte',
                            text: 'Transporte',
                            key: 'Transporte',
                        },
                        { value: 'Saúde', text: 'Saúde', key: 'Saúde' },
                        {
                            value: 'Investimentos',
                            text: 'Investimentos',
                            key: 'Investimentos',
                        },
                        { value: 'Outros', text: 'Outros', key: 'Outros' },
                    ]}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    label="Tag"
                    {...register('tag')}
                    options={[
                        {
                            value: 'Inter PF',
                            text: 'Inter PF',
                            key: 'Inter PF',
                        },
                        {
                            value: 'Inter PJ',
                            text: 'Inter PJ',
                            key: 'Inter PJ',
                        },
                        {
                            value: 'Nubank Cartão',
                            text: 'Nubank Cartão',
                            key: 'Nubank Cartão',
                        },
                        { value: 'Caju', text: 'Caju', key: 'Caju' },
                    ]}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Dia (1-31)"
                    type="number"
                    {...register('dia')}
                    error={formState.errors.dia}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Data de Início"
                    type="date"
                    {...register('inicio')}
                    error={formState.errors.inicio}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Data de Fim"
                    type="date"
                    {...register('fim')}
                    error={formState.errors.fim}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
            </Form>
        </ContentBody>
    );
}
