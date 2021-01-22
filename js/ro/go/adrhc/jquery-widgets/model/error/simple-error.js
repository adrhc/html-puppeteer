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
     * @type {*}
     */
    data;
    /**
     * @type {ServerError[]}
     */
    problems

    /**
     * @param message {string}
     * @param [operation] {string}
     * @param [data] {*}
     * @param [problems] {ServerError[]}
     */
    constructor(message, operation, data, problems = []) {
        this.message = message;
        this.operation = operation;
        this.data = data;
        this.problems = problems;
        this.time = new Date(Date.now()).toLocaleString();
    }

    /**
     * @param data {Array|{}}
     * @return {SimpleError[]|SimpleError}
     */
    static parse(data) {
        if (!data) {
            return undefined;
        }
        if ($.isArray(data)) {
            return data.map(it => SimpleError.parse(it));
        } else {
            const simpleError = $.extend(true, new SimpleError(), data);
            simpleError.problems = ServerError.parse(simpleError.problems);
            return simpleError;
        }
    }
}