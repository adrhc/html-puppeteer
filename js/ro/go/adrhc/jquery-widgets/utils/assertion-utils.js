class AssertionUtils {
    /**
     * @param object
     * @param message {string}
     */
    static isNotNull(object, message) {
        if (object == null) {
            throw `${message}: null object!`;
        }
    }

    /**
     * assertion fails only for expression !== true
     *
     * @param expression {boolean}
     * @param message {string}
     */
    static isFalse(expression, message) {
        if (expression === true) {
            throw message;
        }
    }

    /**
     * @param array {Array}
     * @param message {string}
     */
    static isNullOrEmpty(array, message) {
        if (array && !$.isArray(array)) {
            throw `this is not an array:\n${JSON.stringify(array)}`;
        } else if (array && array.length !== 0) {
            throw message;
        }
    }
}