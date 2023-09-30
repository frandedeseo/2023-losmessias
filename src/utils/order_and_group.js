const days = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
};

function sorter(a, b) {
    if (days[a.day] < days[b.day]) return -1;
    else if (days[a.day] > days[b.day]) return 1;
    else {
        const endTime = parseInt(a.time.trim().split('-')[1]);
        const startTime = parseInt(b.time.trim().split('-')[0]);

        if (endTime <= startTime) return -1;
        else return 1;
    }
}

export function order_and_group(arr) {
    let sortedArr = arr.sort(sorter);
    return sortedArr;
}
