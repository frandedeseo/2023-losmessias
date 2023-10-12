import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUserDispatch } from '@/context/UserContext';

export default function Logout() {
    const router = useRouter();
    const dispatch = useUserDispatch();

    useEffect(() => {
        if (router.isReady) {
            dispatch({ type: 'logout' } );
            router.push("http://localhost:3000");
        }
    }, [router.isReady]);
}