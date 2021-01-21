class RepositoryError {
    /**
     * @type {string}
     */
    message;
    /**
     * fatal: total crash, request not fulfilled
     * warning: partial crash, request partially fulfilled
     *
     * @type {"fatal", "warning"}
     */
    type;
    /**
     * @type {*}
     */
    data;

    /**
     * @param message {string}
     * @param [data] {*}
     * @param [type=error] {string}
     */
    constructor(message, data, type = "error") {
        this.message = message;
        this.data = data;
        this.type = type;
    }
}