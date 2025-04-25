import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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

import { api } from '../../../services/api';
import { showNotification } from '../../../utils/notification';
import { ICompanies } from '../..';
import { formatDate } from '../../../utils/date';
import { cnpjMask } from '../../../utils/cnpj';
import { cpfMask } from '../../../utils/cpf';
import { cepMask } from '../../../utils/cep';
import { Tab } from '../../../components/Tab';
import { TabFields } from '../../../components/TabFields';
import { Table } from '../../../components/Table';
import { TextArea } from '../../../components/TextArea';

interface IFormProps {
    company: string;
    nfekey: string;
    number: string;
    serie: string;
    dateIssue: string;
    dateShipping: string;
    dateExpectedDelivery: string;
    dateDelivery: string;
    codeTrip: string;
    orderTrip: string;
    codeSender: string;
    nameSender: string;
    citySender: string;
    state: string;
    stateSender: string;
    typePersonCustomer: string;
    codeCustomer: string;
    nameCustomer: string;
    street: string;
    numberCustomer: string;
    complement: string;
    district: string;
    cityCustomer: string;
    stateCustomer: string;
    postalCode: string;
    typePersonTransporter: string;
    codeTransporter: string;
    nameTransporter: string;
    cityTransporter: string;
    stateTransporter: string;
    typeFreight: string;
    code: string;
    nfeAdditionalInfo: string;
}

// street;
// numberCustomer;
// complement;
// district;
// postalCode;
// nfeAdditionalInfo;

const newDocumentSchema = yup
    .object({
        nfekey: yup.string().required('Chave da NF-e obrigatória.'),
        number: yup.string().required('Número obrigatório.'),
        serie: yup.string().required('Número de série obrigatório.'),
        typeFreight: yup.string().required('Tipo de frete é obrigatório.'),
        dateIssue: yup.date().typeError('Data de emissão é obrigatória.'),
        // dateShipping: yup.date().typeError('Data de envio é obrigatória.'),
        // dateExpectedDelivery: yup
        //     .date()
        //     .typeError('Data de entrega prevista é obrigatória.'),
        // dateDelivery: yup.date().typeError('Data de entrega é obrigatória.'),
        // codeTrip: yup.string().required('Código da viagem é obrigatório.'),
        orderTrip: yup.string().required('Trecho da viagem é obrigatório.'),
        company: yup.string().required('Empresa remetente é obrigatória.'),
        codeCustomer: yup
            .string()
            .required('CPF/CNPJ do cliente é obrigatório.'),
        nameCustomer: yup.string().required('Nome do cliente é obrigatório.'),
        cityCustomer: yup.string().required('Cidade do cliente é obrigatório.'),
        street: yup.string().required('A rua do cliente é obrigatórioa.'),
        numberCustomer: yup
            .string()
            .required('Número do cliente é obrigatório.'),
        postalCode: yup
            .string()
            .required('CEP do cliente é obrigatório.')
            .min(9, 'O CEP está incorreto')
            .max(9, 'O CEP está incorreto'),
        stateCustomer: yup
            .string()
            .required('Estado do cliente é obrigatório.'),
        district: yup.string().required('Bairro do cliente é obrigatório.'),
        // codeTransporter: yup
        //     .string()
        //     .required('Código da transportadora é obrigatória.'),
        // nameTransporter: yup
        //     .string()
        //     .required('Nome da transportadora é obrigatório.'),
        // cityTransporter: yup
        //     .string()
        //     .required('Cidade da transportadora é obrigatório.'),
        // stateTransporter: yup
        //     .string()
        //     .required('Estado da transportadora é obrigatório.'),
    })
    .required();

const legends = {
    '0': 'text-blue-500',
    '1': 'text-green-500',
    '2': 'text-red-500',
};

type IMode = 'read' | 'insert' | 'edit' | 'remove';
type ITab = 'sender' | 'customer' | 'occurence' | 'transporter' | 'observation';

export default function FormDocuments() {
    const [companies, setCompanies] = useState<ICompanies[]>([]);
    const router = useRouter();
    const id = router.query?.id;
    const [mode, setMode] = useState<IMode>(id === 'new' ? 'insert' : 'read');
    const [tab, setTab] = useState<ITab>('sender');
    const [transporterId, setTransporterId] = useState('');

    const {
        register,
        handleSubmit,
        formState,
        watch,
        reset,
        setValue,
        getValues,
    } = useForm<IFormProps>({
        resolver:
            mode !== 'remove' ? yupResolver(newDocumentSchema) : undefined,
        defaultValues: {
            code: '',
            nfekey: '',
            number: '',
            serie: '',
            typeFreight: '',
            dateIssue: '',
            dateShipping: '',
            dateExpectedDelivery: '',
            dateDelivery: '',
            codeTrip: '',
            orderTrip: '',
            codeSender: '',
            nameSender: '',
            citySender: '',
            stateSender: '',
            codeCustomer: '',
            nameCustomer: '',
            cityCustomer: '',
            stateCustomer: '',
            codeTransporter: '',
            nameTransporter: '',
            cityTransporter: '',
            stateTransporter: '',
            typePersonCustomer: '',
            typePersonTransporter: '',
            street: '',
            numberCustomer: '',
            complement: '',
            district: '',
            postalCode: '',
            nfeAdditionalInfo: '',
            company: '',
            state: '0',
        },
    });
    const sender = watch('company');

    const formatData = useCallback(data => {
        return data.map(item => ({
            ...item,
            number: item.number.toString().padStart(6, '0'),
            legend:
                item.statusCode in legends
                    ? legends[item.statusCode]
                    : 'text-black',
            dateOccurrence: new Date(item.dateOccurrence).toLocaleString(),
        }));
    }, []);

    function chooseMask(
        typePerson: 'typePersonCustomer' | 'typePersonTransporter',
        code: 'codeCustomer' | 'codeTransporter',
    ) {
        if (getValues(typePerson) === 'F') {
            if (getValues(code).length !== 11) {
                showNotification({
                    message: 'CPF deve ter 11 dígitos.',
                });
            }

            return cpfMask(getValues(code));
        } else if (getValues(typePerson) === 'J') {
            if (getValues(code).length !== 14) {
                showNotification({
                    message: 'CNPJ deve ter 14 dígitos.',
                });
            }

            return cnpjMask(getValues(code));
        }
    }

    async function remove() {
        try {
            await api.delete(`/documents/${id}`);
            setMode('remove');
            Router.push('/documents');
        } catch (error) {
            showNotification({
                // eslint-disable-next-line prettier/prettier
                message: `Erro ao ${mode === 'edit' ? 'editar' : 'remover'
                    // eslint-disable-next-line prettier/prettier
                    } empresa.\n${error.response.data.message}`,
            });
        }
    }

    const handleSave: SubmitHandler<IFormProps> = async data => {
        if (mode === 'remove') {
            await remove();
        } else if (mode === 'insert' || mode === 'edit') {
            if (data) {
                try {
                    const dataFormated = {
                        nfekey: data.nfekey,
                        number: data.number,
                        serie: data.serie,
                        typeFreight: data.typeFreight,
                        trip: {
                            code: data.codeTrip,
                            order: data.orderTrip,
                        },
                        sender: {
                            code: data.codeSender,
                        },
                        customer: {
                            typeEntity: data.typePersonCustomer,
                            code: data.codeCustomer,
                            name: data.nameCustomer,
                            city: data.cityCustomer,
                            state: data.stateCustomer,
                            street: data.street,
                            number: data.numberCustomer,
                            complement: data.complement,
                            district: data.district,
                            postalCode: data.postalCode,
                        },
                        transporter: {
                            typeEntity: data.typePersonTransporter,
                            code: data.codeTransporter,
                            name: data.nameTransporter,
                            city: data.cityTransporter,
                            state: data.stateTransporter,
                        },
                        nfeAdditionalInfo: data.nfeAdditionalInfo,
                    };

                    if (data.dateIssue) {
                        dataFormated['dateIssue'] = data.dateIssue;
                    }
                    if (data.dateShipping) {
                        dataFormated['dateShipping'] = data.dateShipping;
                    }
                    if (data.dateExpectedDelivery) {
                        dataFormated['dateExpectedDelivery'] =
                            data.dateExpectedDelivery;
                    }
                    if (data.dateDelivery) {
                        dataFormated['dateDelivery'] = data.dateDelivery;
                    }

                    if (id === 'new') {
                        await api.post('/documents', dataFormated);
                    } else {
                        dataFormated['id'] = id;
                        await api.patch(`/documents/${id}`, dataFormated);
                    }

                    Router.push('/documents');
                } catch (error) {
                    if (id === 'new') {
                        showNotification({
                            message: `Erro ao criar nota.\n${error.response.data.message}`,
                        });
                    } else {
                        showNotification({
                            message: `Erro ao editar nota.\n${error.response.data.message}`,
                        });
                    }
                }
            }
        }
    };

    useEffect(() => {
        api.get('/senders').then(response => {
            const dataCompaniesFormated = [];
            if (response.data.length > 0) {
                response.data.map(company => {
                    return dataCompaniesFormated.push({
                        text: company.name,
                        key: company.id,
                        value: company.id,
                    });
                });
            }

            setCompanies(dataCompaniesFormated);
        });
    }, []);

    useEffect(() => {
        if (sender) {
            if (sender !== 'Escolher') {
                api.get(`/senders/${sender}`).then(response => {
                    setValue('codeSender', response.data.code);
                    setValue('citySender', response.data.city);
                    setValue('stateSender', response.data.state);
                });
            } else {
                setValue('codeSender', '');
                setValue('citySender', '');
                setValue('stateSender', '');
            }
        }
    }, [sender, setValue]);

    useEffect(() => {
        if (id && id !== 'new') {
            api.get(`/documents/${id}`).then(response => {
                setTransporterId(response.data.transporterId);
                reset({
                    nfekey: response.data.nfekey,
                    number: response.data.number,
                    serie: response.data.serie,
                    typeFreight: response.data.typeFreight,
                    dateIssue: formatDate(response.data.dateIssue),
                    dateShipping: formatDate(response.data.dateShipping),
                    dateExpectedDelivery: formatDate(
                        response.data.dateExpectedDelivery,
                    ),
                    state: response.data.status,
                    dateDelivery: formatDate(response.data.dateDelivery),
                    codeTrip: response.data.tripCode ?? '',
                    orderTrip: response.data.tripOrder,
                    company: response.data.senderId,
                    codeSender: response.data.senderCode,
                    nameSender: response.data.senderName,
                    citySender: response.data.senderCity,
                    stateSender: response.data.senderState,
                    codeCustomer: response.data.customerCode,
                    nameCustomer: response.data.customerName,
                    cityCustomer: response.data.customerCity,
                    stateCustomer: response.data.customerState,
                    typePersonCustomer: response.data.customerTypeEntity,
                    codeTransporter: response.data.transporterCode,
                    typePersonTransporter: response.data.transporterTypeEntity,
                    nameTransporter: response.data.transporterName,
                    cityTransporter: response.data.transporterCity,
                    stateTransporter: response.data.transporterState,
                    street: response.data.customerStreet,
                    numberCustomer: response.data.customerNumber,
                    complement: response.data.customerComplement,
                    district: response.data.customerDistrict,
                    postalCode: response.data.customerPostalCode,
                    nfeAdditionalInfo: response.data.nfeAdditionalInfo,
                });
            });
        }
    }, [router.query, reset, companies, id]);

    function sentOccurence() {
        Router.push({
            pathname: '/documents-occurrences/form/new',
            query: { documentId: id, transporterId },
        });
    }

    return (
        <ContentBody>
            <Form onSubmit={handleSubmit(handleSave)}>
                <Buttonbar isForm>
                    <Button
                        onClick={() => sentOccurence()}
                        isLoading={formState.isSubmitting}
                        iconName="FaEdit"
                        hidden={mode !== 'read'}
                        pattern="confirm"
                    >
                        Lançar Ocorrência
                    </Button>

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
                        hidden={mode === 'read'}
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

                <FormLabel>Nota Fiscal</FormLabel>
                <Input
                    label="Chave NF-e"
                    name="nfekey"
                    key="nfekey"
                    type="text"
                    error={formState.errors.nfekey}
                    {...register('nfekey')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Número"
                    name="number"
                    key="number"
                    type="text"
                    error={formState.errors.number}
                    {...register('number')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Série"
                    name="serie"
                    key="serie"
                    type="text"
                    error={formState.errors.serie}
                    {...register('serie')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    label="Tipo de Frete"
                    key="typeFreight"
                    error={formState.errors.typeFreight}
                    {...register('typeFreight', {
                        required: true,
                    })}
                    options={[
                        {
                            value: 'CIF',
                            text: 'CIF',
                            key: 'C',
                        },
                        {
                            value: 'FOB',
                            text: 'FOB',
                            key: 'F',
                        },
                    ]}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Data de Emissão"
                    name="dateIssue"
                    key="dateIssue"
                    type="datetime-local"
                    error={formState.errors.dateIssue}
                    {...register('dateIssue')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Select
                    label="Status"
                    name="state"
                    key="state"
                    {...register('state')}
                    readOnly
                    options={[
                        { value: '0', key: '0', text: 'Faturado' },
                        { value: '1', key: '1', text: 'Em Trânsito' },
                        { value: '2', key: '2', text: 'Entregue' },
                        { value: '3', key: '3', text: 'Devolução' },
                        { value: '4', key: '4', text: 'Reentrega' },
                        { value: '9', key: '9', text: 'Cancelada' },
                    ]}
                />
                <FormLabel>Viagem</FormLabel>
                <Input
                    label="Código"
                    name="codeTrip"
                    key="codeTrip"
                    type="text"
                    error={formState.errors.codeTrip}
                    {...register('codeTrip')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Trecho"
                    name="orderTrip"
                    key="orderTrip"
                    type="number"
                    error={formState.errors.orderTrip}
                    {...register('orderTrip')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Data de Envio"
                    name="dateShipping"
                    key="dateShipping"
                    type="datetime-local"
                    error={formState.errors.dateShipping}
                    {...register('dateShipping')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Data de Entrega Prevista"
                    name="dateExpectedDelivery"
                    key="dateExpectedDelivery"
                    type="datetime-local"
                    error={formState.errors.dateExpectedDelivery}
                    {...register('dateExpectedDelivery')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />
                <Input
                    label="Data de Entrega"
                    name="dateDelivery"
                    key="dateDelivery"
                    type="datetime-local"
                    error={formState.errors.dateDelivery}
                    {...register('dateDelivery')}
                    readOnly={mode !== 'edit' && mode !== 'insert'}
                />

                <Tab<ITab>
                    tabs={[
                        {
                            name: 'sender',
                            title: 'Remetente',
                        },
                        {
                            name: 'customer',
                            title: 'Destinatário',
                        },
                        {
                            name: 'transporter',
                            title: 'Transportadora',
                        },
                        {
                            name: 'observation',
                            title: 'Observação',
                        },
                        {
                            name: 'occurence',
                            title: 'Ocorrências',
                        },
                    ]}
                    tabIs={tab}
                    setTab={setTab}
                >
                    {tab === 'sender' && (
                        <TabFields>
                            <Select
                                label="Empresa"
                                placeholder="Escolher"
                                {...register('company')}
                                error={formState.errors.company}
                                options={companies}
                                readOnly={mode !== 'edit' && mode !== 'insert'}
                            />

                            <Input
                                label="Código (CPF/CNPJ)"
                                name="codeSender"
                                key="codeSender"
                                type="text"
                                // error={formState.errors.codeSender}
                                {...register('codeSender')}
                                readOnly
                            />
                            <Input
                                label="Cidade"
                                name="citySender"
                                key="citySender"
                                type="text"
                                // error={formState.errors.citySender}
                                {...register('citySender')}
                                readOnly
                            />
                            <Input
                                label="Estado"
                                name="stateSender"
                                key="stateSender"
                                type="text"
                                // error={formState.errors.stateSender}
                                {...register('stateSender')}
                                readOnly
                            />
                        </TabFields>
                    )}
                    {tab === 'customer' && (
                        <TabFields>
                            <Select
                                label="Tipo"
                                key="typePersonCustomer"
                                error={formState.errors.typePersonCustomer}
                                {...register('typePersonCustomer', {
                                    required: true,
                                })}
                                placeholder="Escolher"
                                options={[
                                    {
                                        value: 'F',
                                        text: 'Física',
                                        key: 'cpf',
                                    },
                                    {
                                        value: 'J',
                                        text: 'Jurídica',
                                        key: 'cnpj',
                                    },
                                ]}
                                readOnly={mode !== 'insert'}
                                onBlur={() => setValue('codeCustomer', '')}
                            />
                            <Input
                                label="Código (CPF/CNPJ)"
                                name="codeCustomer"
                                key="codeCustomer"
                                type="text"
                                error={formState.errors.codeCustomer}
                                {...register('codeCustomer')}
                                readOnly={mode !== 'insert'}
                                onFocus={() =>
                                    setValue(
                                        'codeCustomer',
                                        getValues('codeCustomer')
                                            ?.replaceAll('.', '')
                                            .replaceAll(' ', '')
                                            .replaceAll('/', '')
                                            .replaceAll('-', ''),
                                    )
                                }
                                onBlur={() =>
                                    setValue(
                                        'codeCustomer',
                                        chooseMask(
                                            'typePersonCustomer',
                                            'codeCustomer',
                                        ),
                                    )
                                }
                            />
                            <Input
                                label="Nome"
                                name="nameCustomer"
                                key="nameCustomer"
                                type="text"
                                error={formState.errors.nameCustomer}
                                {...register('nameCustomer')}
                                readOnly={mode !== 'insert'}
                            />
                            <Input
                                label="CEP"
                                name="postalCode"
                                key="postalCode"
                                type="text"
                                error={formState.errors.postalCode}
                                {...register('postalCode')}
                                readOnly={mode !== 'insert'}
                                onFocus={() =>
                                    setValue(
                                        'postalCode',
                                        getValues('postalCode')?.replaceAll(
                                            '-',
                                            '',
                                        ),
                                    )
                                }
                                onBlur={() =>
                                    setValue(
                                        'postalCode',
                                        cepMask(getValues('postalCode')),
                                    )
                                }
                            />
                            <Input
                                label="Rua"
                                name="street"
                                key="street"
                                type="text"
                                error={formState.errors.street}
                                {...register('street')}
                                readOnly={mode !== 'insert'}
                            />
                            <Input
                                label="Número"
                                name="numberCustomer"
                                key="numberCustomer"
                                type="number"
                                error={formState.errors.numberCustomer}
                                {...register('numberCustomer')}
                                readOnly={mode !== 'insert'}
                            />
                            <Input
                                label="Complemento"
                                name="complement"
                                key="complement"
                                type="text"
                                error={formState.errors.complement}
                                {...register('complement')}
                                readOnly={mode !== 'insert'}
                            />
                            <Input
                                label="Bairro"
                                name="district"
                                key="district"
                                type="text"
                                error={formState.errors.district}
                                {...register('district')}
                                readOnly={mode !== 'insert'}
                            />
                            <Input
                                label="Cidade"
                                name="cityCustomer"
                                key="cityCustomer"
                                type="text"
                                error={formState.errors.cityCustomer}
                                {...register('cityCustomer')}
                                readOnly={mode !== 'insert'}
                            />
                            <Input
                                label="Estado"
                                name="stateCustomer"
                                key="stateCustomer"
                                type="text"
                                error={formState.errors.stateCustomer}
                                {...register('stateCustomer')}
                                readOnly={mode !== 'insert'}
                            />
                        </TabFields>
                    )}
                    {tab === 'transporter' && (
                        <TabFields>
                            <Select
                                label="Tipo"
                                key="typePersonTransporter"
                                error={formState.errors.typePersonTransporter}
                                {...register('typePersonTransporter', {
                                    required: true,
                                })}
                                placeholder="Escolher"
                                options={[
                                    {
                                        value: 'F',
                                        text: 'Física',
                                        key: 'cpf',
                                    },
                                    {
                                        value: 'J',
                                        text: 'Jurídica',
                                        key: 'cnpj',
                                    },
                                ]}
                                readOnly={mode !== 'insert'}
                                onBlur={() => setValue('codeTransporter', '')}
                            />
                            <Input
                                label="Código (CPF/CNPJ)"
                                name="codeTransporter"
                                key="codeTransporter"
                                type="text"
                                error={formState.errors.codeTransporter}
                                {...register('codeTransporter')}
                                readOnly={mode !== 'insert'}
                                onFocus={() =>
                                    setValue(
                                        'codeTransporter',
                                        getValues('codeTransporter')
                                            ?.replaceAll('.', '')
                                            .replaceAll(' ', '')
                                            .replaceAll('/', '')
                                            .replaceAll('-', ''),
                                    )
                                }
                                onBlur={() =>
                                    setValue(
                                        'codeTransporter',
                                        chooseMask(
                                            'typePersonTransporter',
                                            'codeTransporter',
                                        ),
                                    )
                                }
                            />
                            <Input
                                label="Nome"
                                name="nameTransporter"
                                key="nameTransporter"
                                type="text"
                                error={formState.errors.nameTransporter}
                                {...register('nameTransporter')}
                                readOnly={mode !== 'insert'}
                            />
                            <Input
                                label="Cidade"
                                name="cityTransporter"
                                key="cityTransporter"
                                type="text"
                                error={formState.errors.cityTransporter}
                                {...register('cityTransporter')}
                                readOnly={mode !== 'insert'}
                            />
                            <Input
                                label="Estado"
                                name="stateTransporter"
                                key="stateTransporter"
                                type="text"
                                error={formState.errors.stateTransporter}
                                {...register('stateTransporter')}
                                readOnly={mode !== 'insert'}
                            />
                        </TabFields>
                    )}
                    {tab === 'observation' && (
                        <TabFields>
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
                                error={formState.errors.nfeAdditionalInfo}
                                {...register('nfeAdditionalInfo')}
                                readOnly={mode !== 'edit' && mode !== 'insert'}
                            />
                        </TabFields>
                    )}
                    {tab === 'occurence' && (
                        <Table
                            route={
                                mode !== 'insert'
                                    ? `/documents/${id}/occurrences`
                                    : undefined
                            }
                            formatData={formatData}
                            fields={[
                                {
                                    title: 'Status',
                                    name: 'statusTxt',
                                    legend: true,
                                },
                                {
                                    title: 'Num.Ocorrência',
                                    name: 'number',
                                },
                                {
                                    title: 'Nota Fiscal',
                                    name: 'documentNumberSerie',
                                },
                                {
                                    title: 'Ocorrência',
                                    name: 'occurrenceCodeDesc',
                                },
                                {
                                    title: 'Transportadora',
                                    name: 'nameTransporter',
                                },
                                {
                                    title: 'Dt.Ocorrência',
                                    name: 'dateOccurrence',
                                },
                            ]}
                        />
                    )}
                </Tab>
            </Form>
        </ContentBody>
    );
}
