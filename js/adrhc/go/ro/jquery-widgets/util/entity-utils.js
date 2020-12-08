class EntityUtils {
    get NEW_ID() {
        return "newId";
    }

    removeTransientId(object) {
        if (EntityUtils.prototype.isTransient(object)) {
            delete object.id;
        }
        return object;
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