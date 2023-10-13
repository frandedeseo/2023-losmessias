export const fetcher = async (url) => {
    try {
        const res = await fetch(url);
        return res.json();
    } catch (error) {
        console.log(error);
    }
}
export const postFetcher = async (url, token, data) => {
    try {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                Authorization : `Bearer ${token}`
            },
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
                Authorization : `Bearer ${token}`
            },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}