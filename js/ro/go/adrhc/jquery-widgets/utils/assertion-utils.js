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
}