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
        ObjectUtils.copyDeclaredProperties(this, dataAttributes);
    }
}