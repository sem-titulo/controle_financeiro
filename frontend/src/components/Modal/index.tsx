import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '../Form';
import { Button } from '../Button';
import { Buttonbar } from '../Buttonbar';
import { ContentBody } from '../Content';
import { FormLabel } from '../Form/components/FormLabel';
import { IInputProps, Input } from '../Input';
import { ISelectProps, Select } from '../Select';

interface IField {
    name?: string;
    title: string;
    type: 'input' | 'select' | 'label';
    struct?: IInputProps | ISelectProps | string;
}

interface IFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface IModalProps {
    fields?: IField[];
    // validations: yup.AnyObjectSchema;
    handleCloseModal: () => void;
    handleSubmitModal: SubmitHandler<IFormProps>;
}

function renderForm(fields: IField[], register, formState) {
    // const { register, handleSubmit, formState } = useForm();

    return (
        <>
            {fields.map(({ type, name, title, struct }: IField) => {
                if (type === 'label') {
                    return <FormLabel>{title}</FormLabel>;
                }
                if (type === 'input') {
                    return (
                        <Input
                            label={title}
                            name={name}
                            key={name}
                            {...(struct as IInputProps)}
                            error={formState.errors.name}
                            {...register(name, {
                                required: true,
                            })}
                        />
                    );
                }
                return (
                    <Select
                        key={name}
                        label={title}
                        error={formState.errors.name}
                        {...register(name, {
                            required: true,
                        })}
                        {...(struct as ISelectProps)}
                    />
                );
            })}
            <div className="h-24" />
        </>
    );
}

export function Modal({
    fields,
    handleCloseModal,
    handleSubmitModal,
}: IModalProps) {
    const { register, handleSubmit, formState } = useForm();

    return (
        <>
            <div className="flex flex-col justify-center items-center overflow-hidden inset-0 z-50 outline-none focus:outline-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5/6 w-4/5">
                <div className="border-0 w-full rounded-lg shadow-lg bg-white p-2 flex-1 overflow-y-auto">
                    <div className="relative flex flex-col bg-white outline-none focus:outline-none">
                        <ContentBody>
                            <Form onSubmit={handleSubmit(handleSubmitModal)}>
                                <div className="fixed z-50 right-4">
                                    <Buttonbar>
                                        <Button
                                            type="submit"
                                            isLoading={formState.isSubmitting}
                                            iconName="FaCheck"
                                            pattern="confirm"
                                        >
                                            Salvar
                                        </Button>

                                        <Button
                                            colorClass="bg-yellow-500 hover:bg-yellow-600"
                                            onClick={handleCloseModal}
                                            iconName="FaReply"
                                            pattern="revert"
                                        >
                                            Cancelar
                                        </Button>
                                    </Buttonbar>
                                </div>
                                {renderForm(fields, register, formState)}
                            </Form>
                        </ContentBody>
                    </div>
                </div>
            </div>
            <div
                className="opacity-50 w-full h-full fixed inset-0 z-40 bg-black"
                onClick={handleCloseModal}
            />
        </>
    );
}
