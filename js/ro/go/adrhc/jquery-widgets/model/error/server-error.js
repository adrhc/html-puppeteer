class ServerError {
    /**
     * @type {string}
     */
    message;
    /**
     * data pertaining to this error
     *
     * @type {*}
     */
    data;
    /**
     * fatal: total crash, request not fulfilled
     * warning: partial crash, request partially fulfilled
     *
     * @type {"FATAL", "WARNING"}
     */
    type;

    constructor(message, data, type = "FATAL") {
        this.message = message;
        this.data = data;
        this.type = type;
    }

    /**
     * @param data {Array|{}}
     * @return {ServerError[]|ServerError}
     */
    static parse(data) {
        if (!data) {
            return undefined;
        }
        if ($.isArray(data)) {
            return data.map(it => ServerError.parse(it));
        } else {
            return $.extend(true, new ServerError(), data);
        }
    }
}