import {ALERT_ON_FAILED_ASSERTION} from "./GlobalConfig.js";

export default class AssertionUtils {
    /**
     * @param {{}} object
     * @param {string} [message]
     */
    static isNull(object, message) {
        if (object != null) {
            console.error(`isNull failed: ${message}`);
            AssertionUtils._alertOrThrow(message ? `${message}: null object!` : "null object!");
        }
    }

    /**
     * @param {{}} object
     * @param {string} [message]
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
     * @param {boolean} expression
     * @param {string} [message]
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
     * @param {boolean} expression
     * @param {string} [message]
     */
    static isFalse(expression, message) {
        if (expression !== false) {
            console.error(`isFalse failed: ${message}`);
            AssertionUtils._alertOrThrow(message ? message : `${this.constructor.name}.isFalse failed`);
        }
    }

    /**
     * @param {Array} array
     * @param {string} [message]
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

    /**
     * @param {string} exceptionMessage
     * @private
     */
    static _alertOrThrow(exceptionMessage) {
        if (ALERT_ON_FAILED_ASSERTION) {
            alert(exceptionMessage);
        } else {
            throw exceptionMessage;
        }
    }
}