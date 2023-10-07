export function compare_time(a, b) {
    const startingHour = a.split('-')[0].trim().split(':');
    const endingHour = a.split('-')[1].trim().split(':');

    if (
        (parseInt(startingHour[0]) === b.startingHour[0] && parseInt(startingHour[1]) === b.startingHour[1]) ||
        (parseInt(endingHour[0]) === b.endingHour[0] && parseInt(endingHour[1]) === b.endingHour[1])
    )
        return true;
    else if (
        (parseInt(startingHour[0]) > b.startingHour[0] && parseInt(endingHour[0]) < b.endingHour[0]) ||
        (parseInt(startingHour[0]) === b.startingHour[0] &&
            parseInt(startingHour[1]) > b.startingHour[1] &&
            parseInt(endingHour[0]) < b.endingHour[0]) ||
        (parseInt(startingHour[0]) > b.startingHour[0] &&
            parseInt(endingHour[0]) === b.endingHour[0] &&
            parseInt(endingHour[1]) < b.endingHour[1])
    )
        return true;

    return false;
}
