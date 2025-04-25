/* eslint-disable react/jsx-no-constructed-context-values */
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { setCookie, destroyCookie, parseCookies } from 'nookies';
import Router, { useRouter } from 'next/router';
import { api } from '../services/api';
import { showNotification } from '../utils/notification';

interface ISignInData {
    email: string;
    senha: string;
}

interface IUser {
    id: string;
    name: string;
}

interface IAuthContextData {
    user?: IUser;
    isAuthenticated: boolean;
    signIn: (data: ISignInData) => Promise<boolean>;
    signOut: () => void;
}

export function cleanCookies(redirectToLogin = false) {
    destroyCookie(undefined, 'finance.token');
    destroyCookie(undefined, 'finance.user');
    delete api.defaults.headers['authorization'];

    if (redirectToLogin) {
        Router.push('/');
    }
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider({ children }) {
    const [user, setUser] = useState<IUser>(() => {
        const cookies = parseCookies();

        if (cookies['finance.user']) {
            return JSON.parse(cookies['finance.user']);
        }

        return null;
    });

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const cookies = parseCookies();

        return !!cookies['finance.token'];
    });

    const router = useRouter();

    useEffect(() => {
        // redireciona se estiver autenticado
        if (
            isAuthenticated &&
            (router.pathname.startsWith('/register') ||
                router.pathname === '/documents/tracking' ||
                router.pathname === '/')
        ) {
            router.push('/dashboard');
        } else if (
            !isAuthenticated &&
            !(
                router.pathname.startsWith('/register') ||
                router.pathname === '/documents/tracking' ||
                router.pathname === '/'
            )
        ) {
            router.push('/');
        }
    }, [router, isAuthenticated]);

    const signIn = useCallback(
        async function signIn(data: ISignInData): Promise<boolean> {
            try {
                const response = await api.post('/login', data);
                const { access, info } = response.data;

                setCookie(undefined, 'finance.token', access, {
                    maxAge: 60 * 60 * 12 * 1, // 12 horas
                });

                api.defaults.headers['Authorization'] = `Bearer ${access}`;

                setIsAuthenticated(true);

                setCookie(undefined, 'finance.user', JSON.stringify(info));

                setUser(info);

                return true;
            } catch (error) {
                showNotification({ message: 'Login inválido.' });
                return false;
            }
        },
        [],
    );

    const signOut = useCallback(function signOut() {
        cleanCookies();
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const value = useMemo(
        () => ({
            signIn,
            signOut,
            isAuthenticated,
            user,
        }),
        [signIn, signOut, isAuthenticated, user],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
