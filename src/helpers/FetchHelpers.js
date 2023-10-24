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
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export const fetchGetWithTokenCalendar = async ([url, token]) => {
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        }).then(res =>
            res.json().then(json =>
                json.map(e => {
                    if (e.day[2] < 10) e.day[2] = '0' + e.day[2];
                    return e;
                })
            ));
            console.log(res);
        return res;
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