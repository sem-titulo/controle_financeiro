import '../../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import Head from 'next/head';
import { Layout } from '../components/Layout';
import { AuthProvider } from '../contexts/AuthContext';

type NextPageWithLayout = NextPage & {
    hasLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

// sobre elaboração de layouts
// https://nextjs.org/docs/basic-features/layouts

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    const hasLayout =
        Component.hasLayout === undefined ? true : Component.hasLayout;

    // Use the layout defined at the page level, if available
    if (hasLayout) {
        return (
            <>
                <Head>
                    <title>Docs - A melhor solução logística</title>
                </Head>
                <AuthProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </AuthProvider>
                <ToastContainer />
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Docs - A melhor solução logística</title>
            </Head>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
            <ToastContainer />
        </>
    );
}
