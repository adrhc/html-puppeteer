class MustacheTableElemAdapter extends TableElementAdapter {
    /**
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param bodyTmplHtml {string}
     */
    constructor(tableId, bodyRowTmplId, bodyTmplHtml) {
        super(tableId);
        this.bodyRowTmplHtml = HtmlUtils.prototype.templateTextOf(bodyRowTmplId);
        this.bodyTmplHtml = bodyTmplHtml ? bodyTmplHtml : "{{#items}}{{> bodyRowTmpl}}{{/items}}";
    }

    renderBody(data) {
        const html = Mustache.render(this.bodyTmplHtml, data, {bodyRowTmpl: this.bodyRowTmplHtml})
        super.$tbody.html(html);
    }

    renderRowAtIndex(rowIndex, rowTmplHtml, cellsView, replaceExistingIfExists) {
        const rowHtml = cellsView ? Mustache.render(rowTmplHtml, cellsView) : rowTmplHtml;
        super.renderRowAtIndex(rowIndex, rowHtml, replaceExistingIfExists);
    }

    renderRowBeforeDataId(rowDataId, rowTmplHtml, cellsView, replaceExistingIfExists) {
        const rowHtml = cellsView ? Mustache.render(rowTmplHtml, cellsView) : rowTmplHtml;
        super.renderRowBeforeDataId(rowDataId, rowHtml, replaceExistingIfExists);
    }

    renderRowAfterDataId(rowDataId, rowTmplHtml, cellsView, replaceExistingIfExists) {
        const rowHtml = cellsView ? Mustache.render(rowTmplHtml, cellsView) : rowTmplHtml;
        super.renderRowAfterDataId(rowDataId, rowHtml, replaceExistingIfExists);
    }
}