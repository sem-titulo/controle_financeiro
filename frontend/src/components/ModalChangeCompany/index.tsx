import React from 'react';
import { IOptions, Select } from '../Select';

interface IModalProps {
    options: IOptions[];
    handleCloseModal: () => void;
    handleChangeCompany: (key: string) => void;
}
export function ModalChangeCompany({
    options,
    handleCloseModal,
    handleChangeCompany,
}: IModalProps) {
    return (
        <>
            <div className="flex flex-col justify-center items-center overflow-hidden inset-0 z-50 outline-none focus:outline-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-20 w-48">
                <div className="border-0 rounded-lg shadow-lg bg-white p-2 overflow-y-auto">
                    <Select
                        options={options}
                        onChange={event =>
                            handleChangeCompany(event.target.value)
                        }
                    />
                </div>
            </div>
            <div
                className="opacity-50 w-full h-full fixed inset-0 z-40 bg-black"
                onClick={handleCloseModal}
            />
        </>
    );
}
