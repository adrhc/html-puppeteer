class MustacheTableElemAdapter extends TableElementAdapter {
    /**
     * @param tableId {string}
     * @param bodyRowTmplId {string}
     * @param bodyTmplHtml {string|undefined}
     */
    constructor(tableId,
                bodyRowTmplId = `${tableId}RowTmpl`,
                bodyTmplHtml = undefined) {
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

    renderRowAtIndex(rowIndex, rowTmplHtml, cellsView, replaceExisting, putAtBottomIfNotExists) {
        const rowHtml = this._renderTemplate(cellsView, rowTmplHtml);
        super.renderRowAtIndex(rowIndex, rowHtml, replaceExisting, putAtBottomIfNotExists);
    }

    renderRowBeforeDataId(rowDataId, rowTmplHtml, cellsView,
                          replaceExisting, putAtBottomIfNotExists) {
        const rowHtml = this._renderTemplate(cellsView, rowTmplHtml);
        super.renderRowBeforeDataId(rowDataId, rowHtml, replaceExisting, putAtBottomIfNotExists);
    }

    renderRowAfterDataId(rowDataId, rowTmplHtml, cellsView, replaceExisting, putAtBottomIfNotExists) {
        const rowHtml = this._renderTemplate(cellsView, rowTmplHtml);
        super.renderRowAfterDataId(rowDataId, rowHtml, replaceExisting, putAtBottomIfNotExists);
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