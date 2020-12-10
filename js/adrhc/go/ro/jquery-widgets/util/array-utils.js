class ArrayUtils {
    findAndReplaceByFilter(item, items, filter) {
        const index = items.findIndex(filter);
        if (index < 0) {
            return false;
        }
        items.splice(index, 1, item);
        return true;
    }
}