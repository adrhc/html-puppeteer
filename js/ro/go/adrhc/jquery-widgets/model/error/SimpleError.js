/**
 * @template E
 */
class SimpleError {
    /**
     * an error message fitting the operation
     *
     * @type {string}
     */
    message;
    /**
     * this is the original operation involved in the failing request
     * operation refers to anything in the context of the failing request (e.g. "insert" for a CrudRepository)
     *
     * @type {string}
     */
    operation;
    /**
     * this is the original data involved in the failing request
     *
     * @type {E}
     */
    data;
    /**
     * @type {ServerError[]}
     */
    problems

    /**
     * @param {string=} message
     * @param {string=} operation
     * @param {E=} data
     * @param {ServerError[]=} problems
     */
    constructor(message, operation, data, problems = []) {
        this.message = message;
        this.operation = operation;
        this.data = data;
        this.problems = problems;
        this.time = new Date(Date.now()).toLocaleString();
    }

    /**
     * @param {*|[]} values
     * @return {SimpleError[]|SimpleError}
     */
    static parse(values) {
        if (!values) {
            return undefined;
        }
        if ($.isArray(values)) {
            return values.map(it => SimpleError.parse(it));
        } else {
            const simpleError = $.extend(true, new SimpleError(), values);
            simpleError.problems = ServerError.parse(simpleError.problems);
            return simpleError;
        }
    }
}