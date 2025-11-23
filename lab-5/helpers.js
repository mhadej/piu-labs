export function getRandomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 65%)`;
}

export function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}
