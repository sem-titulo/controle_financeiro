/* eslint-disable jsx-a11y/control-has-associated-label */
import Router, { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { HiArrowSmDown, HiArrowSmUp, HiTrash } from 'react-icons/hi';
import { api } from '../../../services/api';
import { showNotification } from '../../../utils/notification';
import { Button } from '../../../components/Button';
import { Buttonbar } from '../../../components/Buttonbar';
import { ContentBody } from '../../../components/Content';
import { Form } from '../../../components/Form';
import { FormLabel } from '../../../components/Form/components/FormLabel';
import { Input } from '../../../components/Input';
import { TabFields } from '../../../components/TabFields';
import { Tab } from '../../../components/Tab';
import { Select } from '../../../components/Select';
import { cnpjMask } from '../../../utils/cnpj';
import TableErrors from '../../../components/TableErrors';

interface IStage {
    id: string;
    order: string;
    name: string;
    occurrenceId: string;
    icon: string;
}

/* Defina seus campos aqui */
interface IFormProps {
    federalCode: string;
    name: string;
    city: string;
    state: string;
    isSender: number;
    isTransporter: number;
    isActive: number;
    pcStatusNewDoc: string;
    pcDocTransp: string;
    stages: IStage[];
}
/* Defina seus campos aqui */
const schema = yup.object({
    federalCode: yup
        .string()
        .required('Código é obrigatório.')
        .min(14, 'O CNPJ deve ser exatamente 14 digitos')
        .max(18, 'O CNPJ deve ser exatamente 14 digitos'),
    name: yup.string().required('Nome é obrigatório.'),
    city: yup.string().required('A cidade é obrigatória.'),
    state: yup
        .string()
        .required('O estado é obrigatório.')
        .min(2, 'O deve ser exatamente 2 caracteres.')
        .max(2, 'O deve ser exatamente 2 caracteres.'),
    isSender: yup.number(),
    isTransporter: yup.number(),
    isActive: yup.number(),
    stages: yup.array().of(
        yup.object({
            occurrenceId: yup.string().required('Ocorrência obrigatória.'),
        }),
    ),
});
/* Defina a base da rota principal */
const baseRoute = '/company';

type IMode = 'read' | 'insert' | 'edit' | 'remove';
type ITab = 'parameter' | 'stage';

export default function Company() {
    const router = useRouter();
    const id = router.query?.id;
    const [loading, setLoading] = useState(true);

    const [mode, setMode] = useState<IMode>(id === 'new' ? 'insert' : 'read');
    const {
        handleSubmit,
        register,
        formState,
        reset,
        control,
        setValue,
        getValues,
    } = useForm<IFormProps>({
        resolver: yupResolver(schema),
        defaultValues: {
            isActive: 1,
        },
    });
    const [transporters, setTransporters] = useState([]);
    const [occurrences, setOcurrences] = useState([]);

    const [tab, setTab] = useState<ITab>('parameter');

    const {
        fields,
        append: appendStage,
        remove: removeStage,
        swap: swapStage,
    } = useFieldArray({
        control,
        name: 'stages',
    });

    const loadData = useCallback(() => {
        if (id !== 'new') {
            api.get<IFormProps>(`${baseRoute}/${id}`).then(response => {
                reset({
                    federalCode: response.data.federalCode,
                    name: response.data.name,
                    city: response.data.city,
                    state: response.data.state,
                    isSender: response.data.isSender ? 1 : 0,
                    isTransporter: response.data.isTransporter ? 1 : 0,
                    isActive: response.data.isActive ? 1 : 0,
                    pcStatusNewDoc: response.data.pcStatusNewDoc,
                    pcDocTransp: response.data.pcDocTransp,
                    stages: response.data.stages,
                });
            });
        }
    }, [id, reset]);

    useEffect(() => {
        if (id === 'new') {
            api.get('users/me').then(response => {
                reset({
                    isSender: response.data.company.isSender ? 1 : 0,
                    isTransporter: response.data.company.isTransporter ? 1 : 0,
                    isActive: response.data.company.isActive ? 1 : 0,
                });
            });
        }
    }, [id, reset]);

    const handleSave: SubmitHandler<IFormProps> = async submitData => {
        if (submitData) {
            const data = {
                ...submitData,
                isSender: submitData.isSender === 1,
                isTransporter: submitData.isTransporter === 1,
                isActive: submitData.isActive === 1,
            };

            try {
                if (id === 'new') {
                    const dataCreate = {
                        ...data,
                    };
                    const response = await api.post(`${baseRoute}`, dataCreate);
                    router.replace(
                        router.asPath.replace('/new', `/${response.data.id}`),
                    );
                } else {
                    await api.patch(`${baseRoute}/${id}`, data);
                }
                setMode('read');
                loadData();
            } catch (error) {
                showNotification({
                    // eslint-disable-next-line prettier/prettier
                    message: `${error.response.data.message}`,
                });
            }
        }
    };

    useEffect(() => {
        const allPromises = Promise.all([
            api.get('/transporters'),
            api.get('/occurrences'),
        ]);

        allPromises.then(([r1, r2]) => {
            let dataFormated = [];
            if (r1.data.length > 0) {
                r1.data.map(transporter => {
                    return dataFormated.push({
                        text: transporter.name,
                        key: transporter.id,
                        value: transporter.id,
                    });
                });
            }
            setTransporters(dataFormated);

            dataFormated = [];

            if (r2.data.length > 0) {
                r2.data.map(occurrence => {
                    return dataFormated.push({
                        text: occurrence.description,
                        key: occurrence.id,
                        value: occurrence.id,
                    });
                });
            }

            setOcurrences(dataFormated);

            setLoading(false);
        });

        if (id && id !== 'new') {
            loadData();
        }
    }, [id, loadData]);

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
                        hidden={mode !== 'edit' && mode !== 'insert'}
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
                <FormLabel>Empresa</FormLabel>
                <Input
                    label="CNPJ"
                    name="federalCode"
                    type="text"
                    error={formState.errors.federalCode}
                    {...register('federalCode')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
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
                    label="Nome"
                    name="name"
                    type="text"
                    error={formState.errors.name}
                    {...register('name')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Cidade"
                    name="city"
                    type="text"
                    error={formState.errors.city}
                    {...register('city')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Estado"
                    name="state"
                    type="text"
                    error={formState.errors.state}
                    {...register('state')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    key="isSender"
                    label="Embarcador"
                    error={formState.errors.isSender}
                    {...register('isSender', {
                        required: true,
                    })}
                    placeholder="Pesquisa por"
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
                    readOnly={mode !== 'edit'}
                />
                <Select
                    key="isTransporter"
                    label="Transportador"
                    error={formState.errors.isTransporter}
                    {...register('isTransporter', {
                        required: true,
                    })}
                    placeholder="Pesquisa por"
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
                    readOnly={mode !== 'edit'}
                />
                <Select
                    key="isActive"
                    label="Ativo"
                    error={formState.errors.isActive}
                    {...register('isActive', {
                        required: true,
                    })}
                    placeholder="Pesquisa por"
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
                    readOnly={mode !== 'edit'}
                />
                <Tab<ITab>
                    tabs={[
                        {
                            name: 'parameter',
                            title: 'Parâmetros',
                        },
                        {
                            name: 'stage',
                            title: 'Etapas',
                        },
                    ]}
                    tabIs={tab}
                    setTab={setTab}
                >
                    {tab === 'parameter' && (
                        <TabFields>
                            <Select
                                label="Status Novo Documento"
                                key="pcStatusNewDoc"
                                error={formState.errors.pcStatusNewDoc}
                                {...register('pcStatusNewDoc', {
                                    required: true,
                                })}
                                options={[
                                    {
                                        value: '0',
                                        text: 'Faturado',
                                        key: '0',
                                    },
                                    {
                                        value: '1',
                                        text: 'Em Trânsito',
                                        key: '1',
                                    },
                                    {
                                        value: '2',
                                        text: 'Entregue',
                                        key: '2',
                                    },
                                ]}
                                readOnly={mode !== 'edit' && mode !== 'insert'}
                            />
                            <Select
                                label="Transportador Padrão"
                                placeholder="Escolher"
                                {...register('pcDocTransp')}
                                error={formState.errors.pcDocTransp}
                                options={transporters}
                                readOnly={mode !== 'edit' && mode !== 'insert'}
                            />
                        </TabFields>
                    )}
                    {tab === 'stage' && (
                        <TabFields>
                            <TableErrors<IStage>
                                errors={formState.errors?.stages}
                            />
                            <table className="mt-3 md:col-span-2 xl:col-span-3">
                                <thead>
                                    <tr>
                                        <th />
                                        <th className="text-left pl-2 font-normal">
                                            Ordem
                                        </th>
                                        <th className="text-left pl-2 font-normal">
                                            Nome
                                        </th>
                                        <th className="text-left pl-2 font-normal">
                                            Ocorrência
                                        </th>
                                        <th className="text-left pl-2 font-normal">
                                            Ícone
                                        </th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    {fields.map((row, index) => {
                                        return (
                                            <tr key={row.id}>
                                                <td className="pb-2">
                                                    <div className="h-12 flex flex-row items-center justify-center space-x-2">
                                                        <button
                                                            type="button"
                                                            className="p-1 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-100 disabled:cursor-not-allowed"
                                                            onClick={() => {
                                                                // eslint-disable-next-line
                                                                const before = getValues(`stages.${index - 1}.order`)
                                                                // eslint-disable-next-line
                                                                const current = getValues(`stages.${index}.order`)
                                                                // eslint-disable-next-line
                                                                setValue(`stages.${index - 1}.order`, current);
                                                                setValue(
                                                                    `stages.${index}.order`,
                                                                    before,
                                                                );
                                                                swapStage(
                                                                    index,
                                                                    index - 1,
                                                                );
                                                            }}
                                                            disabled={
                                                                // eslint-disable-next-line prettier/prettier
                                                                (mode !== 'edit' && mode !== 'insert') || index === 0
                                                            }
                                                        >
                                                            <HiArrowSmUp />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="p-1 bg-gray-50 rounded-md hover:bg-gray-100 transition duration-100 disabled:cursor-not-allowed"
                                                            onClick={() => {
                                                                // eslint-disable-next-line
                                                                const current = getValues(`stages.${index}.order`)
                                                                // eslint-disable-next-line
                                                                const next = getValues(`stages.${index + 1}.order`)
                                                                setValue(
                                                                    `stages.${index}.order`,
                                                                    next,
                                                                );
                                                                // eslint-disable-next-line
                                                                setValue(`stages.${index + 1}.order`, current);
                                                                swapStage(
                                                                    index,
                                                                    index + 1,
                                                                );
                                                            }}
                                                            disabled={
                                                                // eslint-disable-next-line prettier/prettier
                                                                (mode !== 'edit' && mode !== 'insert') || index === fields.length - 1
                                                            }
                                                        >
                                                            <HiArrowSmDown />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="pb-2">
                                                    <Input
                                                        type="text"
                                                        {...register(
                                                            `stages.${index}.order` as const,
                                                        )}
                                                        readOnly
                                                    />
                                                </td>
                                                <td className="pb-2 pl-2">
                                                    <Input
                                                        type="text"
                                                        {...register(
                                                            `stages.${index}.name` as const,
                                                        )}
                                                        readOnly={
                                                            mode !== 'edit' &&
                                                            mode !== 'insert'
                                                        }
                                                    />
                                                </td>
                                                <td className="pb-2 pl-2">
                                                    <Select
                                                        placeholder="Escolher"
                                                        {...register(
                                                            `stages.${index}.occurrenceId` as const,
                                                        )}
                                                        options={occurrences}
                                                        readOnly={
                                                            mode !== 'edit' &&
                                                            mode !== 'insert'
                                                        }
                                                    />
                                                </td>
                                                <td className="pb-2 pl-2">
                                                    <Input
                                                        type="text"
                                                        {...register(
                                                            `stages.${index}.icon` as const,
                                                        )}
                                                        readOnly={
                                                            mode !== 'edit' &&
                                                            mode !== 'insert'
                                                        }
                                                    />
                                                </td>
                                                <td className="pl-2 pb-2">
                                                    {
                                                        // eslint-disable-next-line
                                                        (mode === 'edit' || mode === 'insert') && (
                                                            <button
                                                                className="disabled:cursor-not-allowed"
                                                                onClick={() =>
                                                                    removeStage(
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                <HiTrash />
                                                            </button>
                                                        )
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {(mode === 'insert' || mode === 'edit') && (
                                <Button
                                    onClick={() => {
                                        // eslint-disable-next-line
                                        const order = (1 + parseInt(getValues(`stages.${fields.length - 1}.order`) ?? "0")).toString().padStart(3, '0')

                                        appendStage({
                                            id: undefined,
                                            order,
                                            name: undefined,
                                            occurrenceId: undefined,
                                            icon: undefined,
                                        });
                                    }}
                                >
                                    Adicionar
                                </Button>
                            )}
                        </TabFields>
                    )}
                </Tab>
            </Form>
        </ContentBody>
    );
}
