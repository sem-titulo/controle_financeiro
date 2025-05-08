import { ReactNode, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Logo } from '../Logo';
import { Menu } from './components/Menu';
import { MenuTop } from './components/Menu/MenuTop';
import { MenuItem } from './components/Menu/MenuItem';
import { MenuOptions } from './components/Menu/MenuOptions';
import { Sidebar } from './components/Sidebar';
import { Button } from '../Button';
import { Container } from '../Container';
import { Content } from '../Content';
import { useAuth } from '../../contexts/AuthContext';
import { MenuGroup } from './components/Menu/MenuGroup';

const Header = dynamic(() => import('./components/Header'), { ssr: false });

interface ILayoutProps {
    children: ReactNode;
}

export function Layout({ children }: ILayoutProps) {
    const [isMenuClosed, setIsMenuClosed] = useState(true);
    const { signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = useCallback(() => {
        signOut();
    }, [signOut]);

    const handleOpenCloseMenu = useCallback(() => {
        setIsMenuClosed(prev => !prev);
    }, []);

    useEffect(() => {
        setIsMenuClosed(true);
    }, [router.asPath]);

    return (
        <Container>
            <Sidebar
                isMenuClosed={isMenuClosed}
                addClassName="text-gray-50
                text-xs"
            >
                <Menu>
                    <MenuTop>
                        <Logo
                            vertical
                            addClassName="hidden md:block rounded-md p-1"
                        />
                        <Button
                            className="block md:hidden"
                            colorClass="bg-slate-700 hover:bg-slate-600 text-gray-50"
                            iconName="FaUserCircle"
                            iconClass="h-10 w-10 flex justify-center items-center"
                        />
                    </MenuTop>
                    <MenuOptions>
                        <MenuItem iconName="FaWpforms" href="/dashboard">
                            Dashboard
                        </MenuItem>
                        <MenuGroup iconName="FaPlus" label="Cadastro">
                            <MenuItem iconName="FaExchangeAlt" href="/balance">
                                Transações
                            </MenuItem>
                            <MenuItem iconName="FaSyncAlt" href="/recurrent">
                                Transações Recorrentes
                            </MenuItem>
                        </MenuGroup>
                        <MenuGroup iconName="FaPlus" label="Investimentos">
                            <MenuItem iconName="FaMap" href="/senders">
                                Ações
                            </MenuItem>
                            <MenuItem iconName="FaTruck" href="/transporters">
                                Fii
                            </MenuItem>
                            <MenuItem
                                iconName="FaBriefcaseMedical"
                                href="/occurrences"
                            >
                                Importar Despesas
                            </MenuItem>
                            <MenuItem
                                iconName="FaBriefcaseMedical"
                                href="/occurrences"
                            >
                                Importar Receitas
                            </MenuItem>
                        </MenuGroup>
                        <MenuGroup iconName="FaRegSun" label="Configurações">
                            <MenuItem iconName="FaUser" href="/users">
                                Usuários
                            </MenuItem>
                        </MenuGroup>
                    </MenuOptions>
                </Menu>
                <MenuItem iconName="FaPowerOff" onClick={handleSignOut}>
                    Sair
                </MenuItem>
            </Sidebar>
            <Content>
                <Header
                    addClassName="text-gray-50"
                    onButtonClick={handleOpenCloseMenu}
                />
                {children}
            </Content>
        </Container>
    );
}
