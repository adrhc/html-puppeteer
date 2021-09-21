import GlobalConfig from "./GlobalConfig.js";

/**
 * @param {{}} object
 * @param {string} [message]
 */
export function isNull(object, message) {
    if (object != null) {
        console.error(`isNull failed: ${message}`);
        alertOrThrow(message ? `${message}: null object!` : "null object!");
    }
}

/**
 * @param {{}} object
 * @param {string} [message]
 */
export function isNotNull(object, message) {
    if (object == null) {
        console.error(`isNotNull failed: ${message}`);
        alertOrThrow(message ? `${message}: null object!` : "null object!");
    }
}

/**
 * assertion fails only for expression !== true
 *
 * @param {boolean} expression
 * @param {string} [message]
 */
export function isTrue(expression, message) {
    if (expression !== true) {
        console.error(`isTrue failed: ${message}`);
        alertOrThrow(message ? message : `${this.constructor.name}.isTrue failed`);
    }
}

/**
 * assertion fails only for expression !== false
 *
 * @param {boolean} expression
 * @param {string} [message]
 */
export function isFalse(expression, message) {
    if (expression !== false) {
        console.error(`isFalse failed: ${message}`);
        alertOrThrow(message ? message : `${this.constructor.name}.isFalse failed`);
    }
}

/**
 * @param {Array} array
 * @param {string} [message]
 */
export function isNullOrEmpty(array, message) {
    if (array && !$.isArray(array)) {
        console.error(`isNullOrEmpty failed: ${message}`);
        alertOrThrow(`this is not an array:\n${JSON.stringify(array)}`);
    } else if (array && array.length !== 0) {
        console.error(`isNullOrEmpty failed: ${message}`);
        alertOrThrow(message ? message : `${this.constructor.name}.isNullOrEmpty failed`);
    }
}

/**
 * @param {string} exceptionMessage
 * @private
 */
export function alertOrThrow(exceptionMessage) {
    if (GlobalConfig.ALERT_ON_FAILED_ASSERTION) {
        alert(exceptionMessage);
    } else {
        throw exceptionMessage;
    }
}
