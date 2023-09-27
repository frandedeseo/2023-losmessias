const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#2dd4bf', '#818cf8', '#f472b6'];

export function getColor(string) {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash += string.charCodeAt(i);
    }
    hash = hash % colors.length;

    return colors[hash];
}
