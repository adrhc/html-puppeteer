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
        // return Mustache.render(this.bodyTmplHtml, data, {bodyRowTmpl: this.bodyRowTmplHtml})
        Handlebars.registerPartial("bodyRowTmpl", this.bodyRowTmplHtml)
        const html = this._renderTemplate(data, this.bodyTmplHtml);
        super.$tbody.html(html);
    }

    renderRowAtIndex(rowIndex, rowTmplHtml, cellsView, replaceExistingIfExists) {
        const rowHtml = this._renderTemplate(cellsView, rowTmplHtml);
        super.renderRowAtIndex(rowIndex, rowHtml, replaceExistingIfExists);
    }

    renderRowBeforeDataId(rowDataId, rowTmplHtml, cellsView, replaceExistingIfExists) {
        const rowHtml = this._renderTemplate(cellsView, rowTmplHtml);
        super.renderRowBeforeDataId(rowDataId, rowHtml, replaceExistingIfExists);
    }

    renderRowAfterDataId(rowDataId, rowTmplHtml, cellsView, replaceExistingIfExists) {
        const rowHtml = this._renderTemplate(cellsView, rowTmplHtml);
        super.renderRowAfterDataId(rowDataId, rowHtml, replaceExistingIfExists);
    }

    _renderTemplate(cellsView, rowTmplHtml) {
        // return cellsView ? Mustache.render(rowTmplHtml, cellsView) : rowTmplHtml;
        if (cellsView) {
            const template = Handlebars.compile(rowTmplHtml);
            return template(cellsView);
        } else {
            return rowTmplHtml;
        }
    }
}