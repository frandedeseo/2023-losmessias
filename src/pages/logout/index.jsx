import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserDispatch } from '@/context/UserContext';

export const getServerSideProps = async context => {
    const token = context.req.cookies.token;
    console.log(token);
    let data = { token: token };
    context.res.setHeader('Set-Cookie', 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;');

    return { props: data };
};
export default function Logout({ data }) {
    const router = useRouter();
    const dispatch = useUserDispatch();

    useEffect(() => {
        if (router.isReady) {
            dispatch({ type: 'logout' });
            router.push('/');
        }
    }, [router.isReady, dispatch, router]);
}
