import { serialize } from 'cookie';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { emailRequest, passwordRequest } = req.body;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailRequest,
                password: passwordRequest,
            }),
        };

        try {
            const response = await fetch(`http://localhost:8080/api/authentication`, requestOptions);

            if (response.status === 200) {
                const json = await response.json();
                let token = json.token;
                console.log('Token received:', token);

                const serialized = serialize('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
                    path: '/',
                });

                res.setHeader('Set-Cookie', serialized);

                return res.status(200).json({ token: token });
            } else {
                console.error('Authentication failed with status:', response.status);
                return res.status(response.status).json({ error: 'Error Log In' });
            }
        } catch (error) {
            console.error('Fetch error:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
