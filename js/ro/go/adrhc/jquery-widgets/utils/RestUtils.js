class RestUtils {
    static unwrapHAL(object) {
        if (!object) {
            return object;
        }
        if ($.isArray(object)) {
            object.forEach(it => RestUtils.unwrapHAL(it));
        } else if (object.hasOwnProperty && object.hasOwnProperty("_embedded")) {
            object = object._embedded;
            for (let p in object) {
                if (object.hasOwnProperty(p)) {
                    return RestUtils.unwrapHAL(object[p]);
                }
            }
            return RestUtils.unwrapHAL(object);
        } else {
            delete object._links;
        }
        return object;
    }
}