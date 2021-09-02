class RowConfiguration extends ComponentConfiguration {
    /**
     * @type {undefined|string}
     */
    bodyRowTmplId;
    /**
     * @type {undefined|string}
     */
    bodyRowTmplHtml;

    /**
     * @param {{}=} dataAttributes
     */
    constructor(dataAttributes) {
        super();
        Object.assign(this, dataAttributes);
    }
}