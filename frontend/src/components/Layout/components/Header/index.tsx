import React from 'react';
import * as FontAwesome from 'react-icons/fa';
import { useAuth } from '../../../../contexts/AuthContext';
import { Button } from '../../../Button';
import { Logo } from '../../../Logo';

interface IHeaderProps {
    onButtonClick?: () => void;
    addClassName?: string;
}

export default function Header({ onButtonClick, addClassName }: IHeaderProps) {
    const { user } = useAuth();

    return (
        <header
            className={`py-3 px-4 md:p-0 bg-slate-700 flex flex-row justify-between md:justify-end items-center shadow-2xl ${addClassName}`}
        >
            <Logo addClassName="md:hidden bg-slate-700 rounded-md p-1" />
            <div className="flex justify-center items-center space-x-2">
                <div className="hidden md:flex flex-col items-end">
                    <span className="font-light text-sm">{user?.name}</span>
                </div>
                <Button
                    className="p-5"
                    colorClass="bg-slate-700 hover:bg-slate-600"
                    iconName="FaUserCircle"
                    iconClass="hidden md:block h-10 w-10 flex justify-center items-center"
                />
            </div>
            {onButtonClick && (
                <Button
                    className="md:hidden"
                    colorClass="bg-slate-700 hover:bg-slate-600"
                    iconName="FaAlignJustify"
                    iconClass="h-5 w-5 flex justify-center items-center"
                    onClick={onButtonClick}
                />
            )}
        </header>
    );
}
