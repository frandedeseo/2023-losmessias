const days = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
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

function group(arr) {
    var groupedArr = [];

    arr.forEach(e => {
        const startingHour = e.time.split('-')[0].trim();
        const endingHour = e.time.split('-')[1].trim();
        const index = groupedArr.findIndex(block => block.day === e.day && block.endingHour === startingHour);

        if (index !== -1) {
            groupedArr[index].endingHour = endingHour;
            groupedArr[index].totalHours += 0.5;
        } else {
            groupedArr.push({
                day: e.day,
                startingHour,
                endingHour,
                totalHours: 0.5,
            });
        }
    });

    return groupedArr;
}

export function order_and_group(arr) {
    let sortedArr = arr.sort(sorter);
    let sortedAndGroupedArr = group(sortedArr);
    return sortedAndGroupedArr;
}
