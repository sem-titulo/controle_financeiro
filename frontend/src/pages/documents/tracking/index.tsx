import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { AiFillCheckCircle } from 'react-icons/ai';

import { Form } from '../../../components/Form';
import { Input } from '../../../components/Input';
import { Logo } from '../../../components/Logo';
import { Button } from '../../../components/Button';
import { FormLabel } from '../../../components/Form/components/FormLabel';
import { api } from '../../../services/api';

const schema = yup
    .object({
        numberSearch: yup
            .string()
            .required('Número da nota fiscal obrigatório'),
        serieSearch: yup.string().required('Serie obrigatória'),
        customerSearch: yup.string().required('Destinatário obrigatório'),
    })
    .required();

interface IStage {
    id: string;
    name: string;
    icon: string;
    dateOccurrence: string;
}
interface IFormProps {
    numberSearch: string;
    serieSearch: string;
    customerSearch: string;
    number: string;
    serie: string;
    customerCode: string;
    nfekey: string;
    dateShipping: string;
    dateExpectedDelivery: string;
    dateDelivery: string;
    statusTxt: string;
    stages: IStage[];
}

function TrackingDocument() {
    const [document, setDocument] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { register, handleSubmit, formState, reset, control } =
        useForm<IFormProps>({
            resolver: yupResolver(schema),
        });

    const handleSearch: SubmitHandler<IFormProps> = useCallback(
        async data => {
            const response = await api.get<IFormProps>(
                `/documents/tracking/${data.numberSearch}/${data.serieSearch}/${data.customerSearch}`,
            );

            if (response.data) {
                reset({
                    ...response.data,
                    numberSearch: '',
                    serieSearch: '',
                    customerSearch: '',
                    dateDelivery: response.data.dateDelivery?.substring(0, 22),
                    dateShipping: response.data.dateShipping?.substring(0, 22),
                    dateExpectedDelivery:
                        response.data.dateExpectedDelivery?.substring(0, 22),
                    // eslint-disable-next-line prettier/prettier
                    stages: response.data.stages.map(stage => ({ ...stage, dateOccurrence: stage.dateOccurrence ? new Date(stage.dateOccurrence).toLocaleDateString('pt-BR') : undefined })),
                });
                setDocument(true);
                if (errorMessage) {
                    setErrorMessage(null);
                }
            } else {
                setErrorMessage('Nota não encontrada.');
                setDocument(false);
            }
        },
        [reset, errorMessage],
    );

    const { fields } = useFieldArray({
        control,
        name: 'stages',
    });

    return (
        <div className="h-screen w-screen">
            <Head>
                <title>Docs - Rastreamento</title>
            </Head>
            <header className="py-3 px-4 bg-slate-700 flex flex-row items-start shadow-2xl">
                <Logo />
            </header>
            <div className="max-w-[70%] mx-auto p-10 flex flex-col">
                <Form onSubmit={handleSubmit(handleSearch)}>
                    <Input
                        label="Numero da nota fiscal"
                        name="numberSearch"
                        type="text"
                        error={formState.errors.numberSearch}
                        {...register('numberSearch')}
                    />
                    <Input
                        label="Serie da nota fiscal"
                        name="serieSearch"
                        type="text"
                        error={formState.errors.serieSearch}
                        {...register('serieSearch')}
                    />
                    <Input
                        label="CNPJ Destinatário"
                        name="customerSearch"
                        type="text"
                        error={formState.errors.customerSearch}
                        {...register('customerSearch')}
                    />
                    <Button
                        type="submit"
                        isLoading={formState.isSubmitting}
                        iconClass="md:hidden"
                        iconName="FaArrowRight"
                        addClassName="md:col-span-2 xl:col-span-3"
                    >
                        Pesquisar
                    </Button>
                    {errorMessage && <FormLabel>{errorMessage}</FormLabel>}
                    {document && (
                        <>
                            <FormLabel>Resultado da pesquisa</FormLabel>
                            <Input
                                label="Chave NF-e"
                                name="nfekey"
                                key="nfekey"
                                type="text"
                                error={formState.errors.nfekey}
                                {...register('nfekey')}
                                readOnly
                                labelClassName="md:col-span-2"
                            />
                            <Input
                                label="CNPJ Destinatário"
                                name="customerCode"
                                type="text"
                                error={formState.errors.customerCode}
                                {...register('customerCode')}
                                readOnly
                            />
                            <Input
                                label="Número"
                                name="number"
                                key="number"
                                type="text"
                                error={formState.errors.number}
                                {...register('number')}
                                readOnly
                            />
                            <Input
                                label="Série"
                                name="serie"
                                key="serie"
                                type="text"
                                error={formState.errors.serie}
                                {...register('serie')}
                                readOnly
                            />
                            <Input
                                label="Status"
                                name="statusTxt"
                                key="statusTxt"
                                error={formState.errors.statusTxt}
                                {...register('statusTxt')}
                                readOnly
                            />
                            <Input
                                label="Data de Envio"
                                name="dateShipping"
                                key="dateShipping"
                                type="datetime-local"
                                error={formState.errors.dateShipping}
                                {...register('dateShipping')}
                                readOnly
                            />
                            <Input
                                label="Data de Entrega Prevista"
                                name="dateExpectedDelivery"
                                key="dateExpectedDelivery"
                                type="datetime-local"
                                error={formState.errors.dateExpectedDelivery}
                                {...register('dateExpectedDelivery')}
                                readOnly
                            />
                            <Input
                                label="Data de Entrega"
                                name="dateDelivery"
                                key="dateDelivery"
                                type="datetime-local"
                                error={formState.errors.dateDelivery}
                                {...register('dateDelivery')}
                                readOnly
                            />
                        </>
                    )}
                </Form>

                {fields.length > 0 && (
                    <div className="mt-10 flex flex-col md:flex-row items-center justify-center p-2 space-y-5 md:space-y-0 md:space-x-5 ">
                        {fields.map((stage, index) => (
                            <>
                                <div
                                    className={
                                        // eslint-disable-next-line prettier/prettier
                                        `flex flex-col items-center justify-center space-y-5 md:space-y-0 md:relative ${stage.dateOccurrence ? 'text-green-600' : 'text-gray-600'} `}
                                >
                                    <AiFillCheckCircle className="leading-[8rem] text-[1.5rem]" />
                                    <div className="flex flex-col items-center md:absolute md:-bottom-24">
                                        <p className="text-[1rem] font-bold tracking-wide text-center">
                                            {stage.name}
                                        </p>
                                        <span>
                                            {stage.dateOccurrence ?? '  /  /  '}
                                        </span>
                                    </div>
                                </div>
                                {index + 1 !== fields.length && (
                                    <div className="hidden md:block border-b-[0.25rem] w-[9rem] border-b-green-600" />
                                )}
                            </>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

TrackingDocument.hasLayout = false;

export default TrackingDocument;
