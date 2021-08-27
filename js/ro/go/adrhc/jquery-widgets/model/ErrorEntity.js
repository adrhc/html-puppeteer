class ErrorEntity extends IdentifiableEntity {
    static ERROR_ID_PREFIX = "error-row-";

    /**
     * @type {number|string|undefined}
     */
    failedId;
    /**
     * @type {SimpleError|undefined}
     */
    error;

    /**
     * @param {SimpleError} error
     * @param {number|string=} failedId
     */
    static of(error, failedId = error.data?.id) {
        return _.defaults(new ErrorEntity(), {
            // error.data must come 1th to have its id overwritten by the computed error id
            ...error.data,
            // id is used to identify the error-row
            id: `${ErrorEntity.ERROR_ID_PREFIX}${failedId}`,
            // failedId could be used for setting "data-secondary-row-part" attribute
            failedId,
            error
        });
    }

    /**
     * @param {string|number} id
     * @return {boolean}
     */
    static isErrorItemId(id) {
        return typeof id === "string" && id.startsWith(ErrorEntity.ERROR_ID_PREFIX);
    }
}