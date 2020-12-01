class EntityUtils {
    hasEmptyId(item) {
        return !$.isNumeric(item.id);
    }

    isTransientId(id) {
        return id === "newItem";
    }

    isTransient(item) {
        return item.id === "newItem";
    }
}