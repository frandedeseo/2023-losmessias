// Components
import { useState, useEffect } from 'react';
import Page from './sign-up/Page';
import TopNav from './TopNav';
import { useRouter } from 'next/router';
import { useApi } from '../hooks/useApi.js';

export default function Home({ data, subjects }) {
    const [page, setPage] = useState('login');

    const { confirmToken } = useApi();

    const router = useRouter();
    var token = router.query.token;

    useEffect(() => {
        if (token != undefined) {
            confirmToken(token);
        }
    }, [token, confirmToken]);

    return (
        <>
            <TopNav setPage={setPage} />
            <Page page={page} setPage={setPage} />
        </>
    );
}
