class RowConfiguration extends ComponentConfiguration {
    /**
     * @type {"prepend"|"append"}
     */
    rowPositionOnCreate;

    /**
     * Evaluation order:
     * - options (programmatically provided configuration)
     * - data-* values of the template (options.bodyRowTmplHtml or options.bodyRowTmplId)
     * - elemIdOrJQuery: elemIdOrJQuery
     *
     * @param {string|jQuery<HTMLElement>|function(): jQuery<HTMLElement>} elemIdOrJQuery is the table
     * @param {Object=} options
     * @return {RowConfiguration}
     */
    static of(elemIdOrJQuery, options) {
        const htmlDataValues = DomUtils.dataOfTemplateOrHtml(options.bodyRowTmplId, options.bodyRowTmplHtml)
        delete htmlDataValues?.id;
        return _.defaults(new RowConfiguration(), options, htmlDataValues, {elemIdOrJQuery});
    }
}