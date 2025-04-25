/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '../Form';
import { Button } from '../Button';
import { Buttonbar } from '../Buttonbar';

interface IModalProps<T> {
    setFiles: React.Dispatch<React.SetStateAction<FormData>>
    handleCloseModal: () => void;
    handleSubmitModal: SubmitHandler<T>;
    filesKey?: string;
}

export function DragDrop<T = unknown>({
    setFiles,
    handleCloseModal,
    handleSubmitModal,
    filesKey = 'files'
}: IModalProps<T>) {
    const [numberFiles, setNumberFiles] = useState(0);
    const { handleSubmit, formState } = useForm<T>();

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            const formData = new FormData();
            acceptedFiles.forEach(file => formData.append(filesKey, file));
            setFiles(formData);
            setNumberFiles(formData.getAll(filesKey).length);
        },
    });

    return (
        <>
            <div className="overflow-hidden inset-0 z-50 outline-none focus:outline-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] xl:w-1/3 max-h-min bg-white rounded-md">
                <div className="z-50 p-5">
                    <Buttonbar>
                        <Button
                            type="submit"
                            form='form-send-files'
                            isLoading={formState.isSubmitting}
                            iconName="FaCheck"
                            pattern='confirm'
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
                    id='form-send-files'
                    onSubmit={handleSubmit(handleSubmitModal)}
                    className="flex flex-col px-5 pb-5"
                >


                    <div
                        className="rounded-3xl"
                        {...getRootProps()}
                    >
                        <div className="rounded-lg border-2 border-dashed border-slate-400 grid w-full place-content-center p-8 box-border place-items-center">
                            <div>
                                <span>Arraste os XML aqui.</span>
                                <div className="text-center my-2">
                                    <span>ou</span>
                                </div>
                            </div>
                            <input {...getInputProps()} />
                            <div>
                                <Button
                                    className="
                                                h-8
                                                md:h-12
                                                w-22
                                                md:w-42
                                                shadow-md
                                                flex
                                                flex-row
                                                space-x-3
                                                items-center
                                                justify-center
                                                font-light
                                                px-4
                                                py-2
                                                text-black
                                                rounded-md
                                                tracking-wide
                                            "
                                    iconName="FaPlus"
                                >
                                    Adicionar documentos
                                </Button>
                                <br />
                                <span className="text-center">
                                    {numberFiles > 1
                                        ? `${numberFiles} documentos`
                                        : `${numberFiles} documento`}{' '}
                                </span>
                            </div>
                        </div>
                    </div>
                </Form>
            </div>

            <div
                className="opacity-50 w-full h-full fixed inset-0 z-40 bg-black"
                onClick={handleCloseModal}
            />
        </>
    );
}
