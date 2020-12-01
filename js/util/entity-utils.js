class EntityUtils {
    get NEW_ID() {
        return "newId";
    }

    hasEmptyId(item) {
        return !$.isNumeric(item.id);
    }

    isTransientId(id) {
        return id === "newId";
    }

    isTransient(item) {
        return item.id === "newId";
    }
}