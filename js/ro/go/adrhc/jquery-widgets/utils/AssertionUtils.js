class AssertionUtils {
    /**
     * @param object
     * @param [message] {string}
     */
    static isNull(object, message) {
        if (object != null) {
            console.error(`isNull failed: ${message}`);
            AssertionUtils._alertOrThrow(message ? `${message}: null object!` : "null object!");
        }
    }

    /**
     * @param object
     * @param [message] {string}
     */
    static isNotNull(object, message) {
        if (object == null) {
            console.error(`isNotNull failed: ${message}`);
            AssertionUtils._alertOrThrow(message ? `${message}: null object!` : "null object!");
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
            console.error(`isTrue failed: ${message}`);
            AssertionUtils._alertOrThrow(message ? message : `${this.constructor.name}.isTrue failed`);
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
            console.error(`isFalse failed: ${message}`);
            AssertionUtils._alertOrThrow(message ? message : `${this.constructor.name}.isFalse failed`);
        }
    }

    /**
     * @param array {Array}
     * @param [message] {string}
     */
    static isNullOrEmpty(array, message) {
        if (array && !$.isArray(array)) {
            console.error(`isNullOrEmpty failed: ${message}`);
            AssertionUtils._alertOrThrow(`this is not an array:\n${JSON.stringify(array)}`);
        } else if (array && array.length !== 0) {
            console.error(`isNullOrEmpty failed: ${message}`);
            AssertionUtils._alertOrThrow(message ? message : `${this.constructor.name}.isNullOrEmpty failed`);
        }
    }

    static _alertOrThrow(exceptionMessage) {
        if (JQueryWidgetsConfig.ALERT_ON_FAILED_ASSERTION) {
            alert(exceptionMessage);
        } else {
            throw exceptionMessage;
        }
    }
}