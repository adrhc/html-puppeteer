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

    /**
     * @param rowDataId {number|string}
     * @param rowTmplHtml {string}
     * @param data
     * @param replaceExisting {boolean|undefined}
     * @param putAtBottomIfNotExists {boolean|undefined}
     */
    renderRowBeforeDataId(rowDataId, rowTmplHtml, data,
                          replaceExisting, putAtBottomIfNotExists) {
        this.renderRowWithTemplate({
            rowDataId,
            data,
            rowTmplHtml,
            replaceExisting,
            tableRelativePosition: putAtBottomIfNotExists ? "append" : "prepend",
            createIfNotExists: true
        });
    }

    /**
     * @param rowDataId {number|string}
     * @param data
     * @param rowTmplHtml {string}
     * @param replaceExisting {boolean|undefined}
     * @param neighbourRowDataId {number|string}
     * @param neighbourRelativePosition {"before"|"after"|undefined}
     * @param tableRelativePosition {"prepend"|"append"|undefined}
     * @param createIfNotExists {boolean|undefined}
     */
    renderRowWithTemplate({
                           rowDataId,
                           data,
                           rowTmplHtml,
                           replaceExisting,
                           neighbourRowDataId,
                           neighbourRelativePosition,
                           tableRelativePosition,
                           createIfNotExists
                       }) {
        const rowHtml = this._renderTemplate(data, rowTmplHtml);
        super.renderRow({
            rowDataId,
            rowHtml,
            replaceExisting,
            neighbourRowDataId,
            neighbourRelativePosition,
            tableRelativePosition,
            createIfNotExists
        });
    }

    /**
     * @param data
     * @param rowTmplHtml {string}
     * @return {string}
     * @private
     */
    _renderTemplate(data, rowTmplHtml) {
        // return data ? Mustache.render(rowTmplHtml, data) : rowTmplHtml;
        if (data) {
            const template = Handlebars.compile(rowTmplHtml);
            return template(data);
        } else {
            return rowTmplHtml;
        }
    }
}