// components/DragDrop.tsx

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useForm, SubmitHandler } from 'react-hook-form';

import { Form } from '../Form';
import { Button } from '../Button';
import { Buttonbar } from '../Buttonbar';
import { Select } from '../Select';
import { Input } from '../Input';

interface IFormFields {
    mes: string;
    ano: number;
    tipo_arquivo: string;
}

interface IModalProps {
    setFiles: React.Dispatch<React.SetStateAction<FormData>>;
    handleCloseModal: () => void;
    handleSubmitModal: SubmitHandler<IFormFields>;
}

export function DragDrop({
    setFiles,
    handleCloseModal,
    handleSubmitModal,
}: IModalProps) {
    const [numberFiles, setNumberFiles] = useState(0);
    const { register, handleSubmit, formState } = useForm<IFormFields>();

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            const formData = new FormData();
            acceptedFiles.forEach(file => formData.append('file', file));
            setFiles(formData);
            setNumberFiles(formData.getAll('file').length);
        },
    });

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="w-[90%] xl:w-1/3 max-h-[90vh] overflow-y-auto bg-white rounded-md">
                    <div className="p-5">
                        <Buttonbar>
                            <Button
                                type="submit"
                                form="form-send-files"
                                isLoading={formState.isSubmitting}
                                iconName="FaCheck"
                                pattern="confirm"
                            >
                                Salvar
                            </Button>
                            <Button
                                onClick={handleCloseModal}
                                iconName="FaReply"
                            >
                                Cancelar
                            </Button>
                        </Buttonbar>
                    </div>

                    <Form
                        id="form-send-files"
                        onSubmit={handleSubmit(handleSubmitModal)}
                        className="flex flex-col px-5 pb-5 space-y-4"
                    >
                        <div {...getRootProps()} className="cursor-pointer">
                            <div className="rounded-lg border-2 border-dashed border-slate-400 grid w-full place-content-center p-8 box-border place-items-center">
                                <input {...getInputProps()} />
                                <div className="text-center">
                                    <span className="block">
                                        Arraste o documento aqui
                                    </span>
                                    <div className="my-2">ou</div>
                                    <Button
                                        className="
                      h-8 md:h-12 w-22 md:w-42 shadow-md flex flex-row space-x-3
                      items-center justify-center font-light px-4 py-2 text-black
                      rounded-md tracking-wide
                    "
                                        iconName="FaPlus"
                                    >
                                        Adicionar documentos
                                    </Button>
                                    <p className="mt-3 text-sm text-gray-600">
                                        {numberFiles > 1
                                            ? `${numberFiles} documentos`
                                            : numberFiles === 1
                                            ? '1 documento'
                                            : 'Nenhum documento selecionado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Select
                            label="Mês"
                            {...register('mes')}
                            options={[
                                'Janeiro',
                                'Fevereiro',
                                'Março',
                                'Abril',
                                'Maio',
                                'Junho',
                                'Julho',
                                'Agosto',
                                'Setembro',
                                'Outubro',
                                'Novembro',
                                'Dezembro',
                            ].map(m => ({ key: m, value: m, text: m }))}
                        />

                        <Input label="Ano" type="number" {...register('ano')} />

                        <Select
                            label="Tipo de Arquivo"
                            {...register('tipo_arquivo')}
                            options={[
                                {
                                    key: 'extrato_inter',
                                    value: 'extrato_inter',
                                    text: 'Extrato Inter',
                                },
                                {
                                    key: 'fatura_inter',
                                    value: 'fatura_inter',
                                    text: 'Fatura Inter',
                                },
                                {
                                    key: 'extrato_nubank',
                                    value: 'extrato_nubank',
                                    text: 'Extrato Nubank',
                                },
                                {
                                    key: 'fatura_nubank',
                                    value: 'fatura_nubank',
                                    text: 'Fatura Nubank',
                                },
                            ]}
                        />
                    </Form>
                </div>
            </div>

            <div
                className="opacity-50 w-full h-full fixed inset-0 z-40 bg-black"
                onClick={handleCloseModal}
            />
        </>
    );
}
