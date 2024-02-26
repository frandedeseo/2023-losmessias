import { NextResponse } from 'next/server';

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
        console.log(json);

        let token = json.token;

        const responseData = {
            token,
        };
        res.headers = {
            'Set-Cookie': `myTokenName=${token}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Strict; Max-Age=${
                1000 * 60 * 60 * 24 * 30
            }; Path=/`,
            'Content-Type': 'application/json',
        };
        return res.json({ token: responseData });
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
