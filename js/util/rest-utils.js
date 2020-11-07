class RestUtils {
    unwrapHAL(object) {
        if (object.hasOwnProperty("_embedded")) {
            object = object._embedded;
            for (let p in object) {
                if (object.hasOwnProperty(p)) {
                    return this.unwrapHAL(object[p]);
                }
            }
            return this.unwrapHAL(object);
        } else if ($.isArray(object)) {
            object.forEach(it => this.unwrapHAL(it));
        } else {
            delete object._links;
        }
        return object;
    }

}