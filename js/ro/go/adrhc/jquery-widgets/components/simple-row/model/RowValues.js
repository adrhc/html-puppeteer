class RowValues {
    /**
     * @type {*}
     */
    values;
    /**
     * @type {number}
     */
    index;

    /**
     * @param {*} values
     * @param {number} [index]
     */
    constructor(values, index = 0) {
        this.values = values;
        this.index = index;
    }
}