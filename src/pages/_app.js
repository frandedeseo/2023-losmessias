import Layout from '@/components/ui/Layout';
import '@/styles/globals.css';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { UserProvider } from '@/context/UserContext';

export default function App({ Component, pageProps }) {
    // const router = useRouter();
    // const [isLoading, setIsLoading] = useState(true);

    // const { asPath } = useRouter();

    // useEffect(() => {
    //     setIsLoading(true);
    //     const fetchData = async () => {
    //         const user = JSON.parse(localStorage.getItem('user'));
    //         console.log(asPath);
    //         setIsLoading(false);
    //     };

    //     const handleRouteChange = () => {
    //         setIsLoading(false);
    //     };

    //     router.events.on('routeChangeComplete', handleRouteChange);

    //     if (router.isReady && asPath) {
    //         fetchData();
    //     }

    //     return () => {
    //         router.events.off('routeChangeComplete', handleRouteChange);
    //     };
    // }, [asPath, router]);

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
