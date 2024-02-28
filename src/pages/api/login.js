import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export default async function POST(request, res) {
    const { emailRequest, passwordRequest } = await request.body;
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: emailRequest,
            password: passwordRequest,
        }),
    };

    const response = await fetch(`http://localhost:8080/api/authentication`, requestOptions);

    if (response.status === 200) {
        const json = await response.json();
        let token = json.token;
        console.log(token);

        const serialized = serialize('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 1000 * 60 * 60 * 24 * 30,
            path: '/',
        });

        res.setHeader('Set-Cookie', serialized);

        return res.json({ token: token });
    } else {
        console.log('Error:', response.status);
        return {
            status: response.status,
            body: { error: 'Error Log In' },
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
}
