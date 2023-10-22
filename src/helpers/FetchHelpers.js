export const fetcher = async (url) => {
    try {

        const res = await fetch(url);
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export const fetcherGetWithToken = async ([url, token]) => {
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        console.log(res)
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export const fetcherPostWithToken = async ([url, token, body]) => {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: body
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export const patchFetcher = async (url, token, data) => {
    try {
        const res = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization: `Bearer ${token}`
            },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}