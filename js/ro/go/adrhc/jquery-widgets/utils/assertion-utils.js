class AssertionUtils {
    /**
     * @param object
     * @param message {string}
     */
    static assertNotNull(object, message) {
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
    static assertNotTrue(expression, message) {
        if (expression === true) {
            throw message;
        }
    }
}