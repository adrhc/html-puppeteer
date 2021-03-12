class AssertionUtils {
    /**
     * @param object
     * @param [message] {string}
     */
    static isNull(object, message) {
        if (object != null) {
            console.error(`AssertionUtils.isNull failed: ${message}`);
            throw !!message ? `${message}: null object!` : "null object!";
        }
    }

    /**
     * @param object
     * @param [message] {string}
     */
    static isNotNull(object, message) {
        if (object == null) {
            console.error(`AssertionUtils.isNotNull failed: ${message}`);
            throw !!message ? `${message}: null object!` : "null object!";
        }
    }

    /**
     * assertion fails only for expression !== true
     *
     * @param expression {boolean}
     * @param [message] {string}
     */
    static isTrue(expression, message) {
        if (expression !== true) {
            console.error(`AssertionUtils.isTrue failed: ${message}`);
            throw !!message ? message : `${this.constructor.name}.isTrue failed`;
        }
    }

    /**
     * assertion fails only for expression !== false
     *
     * @param expression {boolean}
     * @param [message] {string}
     */
    static isFalse(expression, message) {
        if (expression !== false) {
            console.error(`AssertionUtils.isFalse failed: ${message}`);
            throw !!message ? message : `${this.constructor.name}.isFalse failed`;
        }
    }

    /**
     * @param array {Array}
     * @param [message] {string}
     */
    static isNullOrEmpty(array, message) {
        if (array && !$.isArray(array)) {
            console.error(`AssertionUtils.isNullOrEmpty failed: ${message}`);
            throw `this is not an array:\n${JSON.stringify(array)}`;
        } else if (array && array.length !== 0) {
            console.error(`AssertionUtils.isNullOrEmpty failed: ${message}`);
            throw !!message ? message : `${this.constructor.name}.isNullOrEmpty failed`;
        }
    }
}