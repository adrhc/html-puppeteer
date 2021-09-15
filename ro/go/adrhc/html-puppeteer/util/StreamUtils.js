export function rangeIterator(min, max, fn) {
    for (let i = min; i <= max; i++) {
        fn(i);
    }
}