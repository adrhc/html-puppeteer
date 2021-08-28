class MustacheTableElemAdapterOptions {
    /**
     * @type {string}
     */
    elemIdOrJQuery;
    /**
     * the id of the <template> for a single row
     *
     * @type {string}
     */
    bodyRowTmplId;
    /**
     * the <template> for a single row
     *
     * @type {string}
     */
    bodyRowTmplHtml;
    /**
     * the rule to generate the rows, when !!bodyRowTmplHtml by default is: {{#items}}{{> bodyRow}}{{/items}}
     *
     * @type {string}
     */
    bodyTmplHtml;
    /**
     * @type {string}
     */
    rowDataId;
    /**
     * @type {string}
     */
    rowPositionOnCreate;
}