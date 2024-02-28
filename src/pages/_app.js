import Layout from '@/components/ui/Layout';
import '@/styles/globals.css';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UserContext } from '@/context/UserContext';
import { UserProvider } from '@/context/UserContext';
import { useUserDispatch } from '@/context/UserContext';

export default function App({ Component, pageProps, data }) {
    // const dispatch = useUserDispatch();

    // useEffect(() => {
    //     console.log(pageProps);
    //     dispatch({
    //         type: 'login',
    //         payload: data,
    //     });
    // }, []);

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
