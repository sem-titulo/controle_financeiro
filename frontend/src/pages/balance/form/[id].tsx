import React, { useCallback, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Router, { useRouter } from 'next/router';

import { ContentBody } from '../../../components/Content';
import { Form } from '../../../components/Form';
import { Button } from '../../../components/Button';
import { Buttonbar } from '../../../components/Buttonbar';
import { FormLabel } from '../../../components/Form/components/FormLabel';
import { Input } from '../../../components/Input';
import { Select } from '../../../components/Select';
import { TextArea } from '../../../components/TextArea';

import { api } from '../../../services/api';
import { showNotification } from '../../../utils/notification';

interface IFormProps {
    fonte: string;
    valor: number;
    mes: string;
    ano?: number;
    tipo?: string;
    tag?: string;
    categoria?: string;
    observacao?: string;
}

const balancoSchema = yup
    .object({
        fonte: yup.string().required('Fonte é obrigatória.'),
        valor: yup
            .number()
            .required('Valor é obrigatório.')
            .typeError('Valor deve ser numérico.'),
        mes: yup.string().required('Mês é obrigatório.'),
        ano: yup.number().typeError('Ano deve ser um número.').nullable(),
        tipo: yup.string().nullable(),
        tag: yup.string().nullable(),
        categoria: yup.string().nullable(),
        observacao: yup.string().nullable(),
    })
    .required();

type IMode = 'read' | 'insert' | 'edit' | 'remove';

export default function FormBalanco() {
    const router = useRouter();
    const id = router.query?.id;
    const [mode, setMode] = useState<IMode>(id === 'new' ? 'insert' : 'read');

    const { register, handleSubmit, formState, reset, setValue } =
        useForm<IFormProps>({
            resolver: yupResolver(balancoSchema),
            defaultValues: {
                fonte: '',
                valor: 0,
                mes: '',
                ano: undefined,
                tipo: undefined,
                tag: undefined,
                categoria: undefined,
                observacao: '',
            },
        });

    async function remove() {
        try {
            await api.delete(`/balance/deletar/${id}`);
            Router.push('/balance');
        } catch (error: any) {
            showNotification({
                message: `Erro ao remover balanço.\n${
                    error?.response?.data?.detail?.error || error.message
                }`,
            });
        }
    }

    const handleSave: SubmitHandler<IFormProps> = async data => {
        try {
            if (mode === 'insert') {
                await api.post('/balance', data);
                Router.push('/balance');
            } else if (mode === 'edit') {
                await api.put(`/balance/${id}`, data);
                Router.push('/balance');
            }
        } catch (error: any) {
            showNotification({
                message: `Erro ao salvar.\n${
                    error?.response?.data?.error || error.message
                }`,
            });
        }
    };

    useEffect(() => {
        if (id && id !== 'new') {
            api.get(`/balance/${id}`).then(response => {
                reset(response.data);
            });
        }
    }, [id, reset]);

    return (
        <ContentBody>
            <Form onSubmit={handleSubmit(handleSave)}>
                <Buttonbar isForm>
                    {mode === 'read' && (
                        <>
                            <Button
                                onClick={() => setMode('edit')}
                                iconName="FaEdit"
                                pattern="confirm"
                            >
                                Editar
                            </Button>
                            <Button
                                onClick={() => remove()}
                                iconName="FaTrash"
                                pattern="revert"
                            >
                                Remover
                            </Button>
                        </>
                    )}
                    {(mode === 'edit' || mode === 'insert') && (
                        <Button
                            type="submit"
                            isLoading={formState.isSubmitting}
                            iconName="FaCheck"
                            pattern="confirm"
                        >
                            Salvar
                        </Button>
                    )}
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

                <FormLabel>Transações</FormLabel>
                <Input
                    label="Fonte"
                    {...register('fonte')}
                    error={formState.errors.fonte}
                    readOnly={mode === 'read'}
                />
                <Input
                    label="Valor"
                    type="number"
                    {...register('valor')}
                    error={formState.errors.valor}
                    readOnly={mode === 'read'}
                />
                <Select
                    label="Mês"
                    {...register('mes')}
                    options={[
                        { key: 'Janeiro', value: 'Janeiro', text: 'Janeiro' },
                        {
                            key: 'Fevereiro',
                            value: 'Fevereiro',
                            text: 'Fevereiro',
                        },
                        { key: 'Março', value: 'Março', text: 'Março' },
                        { key: 'Abril', value: 'Abril', text: 'Abril' },
                        { key: 'Maio', value: 'Maio', text: 'Maio' },
                        { key: 'Junho', value: 'Junho', text: 'Junho' },
                        { key: 'Julho', value: 'Julho', text: 'Julho' },
                        { key: 'Agosto', value: 'Agosto', text: 'Agosto' },
                        {
                            key: 'Setembro',
                            value: 'Setembro',
                            text: 'Setembro',
                        },
                        { key: 'Outubro', value: 'Outubro', text: 'Outubro' },
                        {
                            key: 'Novembro',
                            value: 'Novembro',
                            text: 'Novembro',
                        },
                        {
                            key: 'Dezembro',
                            value: 'Dezembro',
                            text: 'Dezembro',
                        },
                    ]}
                    error={formState.errors.mes}
                    readOnly={mode === 'read'}
                />
                <Input
                    label="Ano"
                    type="number"
                    {...register('ano')}
                    error={formState.errors.ano}
                    readOnly={mode === 'read'}
                />
                <Select
                    label="Tipo"
                    {...register('tipo')}
                    options={[
                        { key: 'Entrada', value: 'Entrada', text: 'Entrada' },
                        { key: 'Saída', value: 'Saída', text: 'Saída' },
                    ]}
                    readOnly={mode === 'read'}
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
                        { value: 'Moradia', text: 'Moradia', key: 'Moradia' },
                        {
                            value: 'Educação',
                            text: 'Educação',
                            key: 'Educação',
                        },
                        { value: 'Saúde', text: 'Saúde', key: 'Saúde' },
                        { value: 'Lazer', text: 'Lazer', key: 'Lazer' },
                        {
                            value: 'Investimentos',
                            text: 'Investimentos',
                            key: 'Investimentos',
                        },
                        { value: 'Outros', text: 'Outros', key: 'Outros' },
                        // Adicione todas se quiser
                    ]}
                    readOnly={mode === 'read'}
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
                        { value: 'Caju', text: 'Caju', key: 'Caju' },
                        {
                            value: 'Nubank Cartão',
                            text: 'Nubank Cartão',
                            key: 'Nubank Cartão',
                        },
                        {
                            value: 'Nubank PF',
                            text: 'Nubank PF',
                            key: 'Nubank PF',
                        },
                        {
                            value: 'Inter Cartão',
                            text: 'Inter Cartão',
                            key: 'Inter Cartão',
                        },
                    ]}
                    readOnly={mode === 'read'}
                />
                <TextArea
                    label="Observação"
                    {...register('observacao')}
                    error={formState.errors.observacao}
                    readOnly={mode === 'read'}
                />
            </Form>
        </ContentBody>
    );
}
