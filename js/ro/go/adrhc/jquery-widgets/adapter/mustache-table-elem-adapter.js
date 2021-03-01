/**
 * Defaults:
 *
 * tableId = tableId or $table.data("id") or $table.attr("id")
 * bodyRowTmplId = bodyRowTmplId or ${tableId}RowTmpl
 */
class MustacheTableElemAdapter extends TableElementAdapter {
    /**
     * @param tableId {string|jQuery<HTMLTableRowElement>}
     * @param bodyRowTmplId {string}
     * @param [bodyRowTmplHtml] {string}
     * @param [bodyTmplHtml] {string}
     */
    constructor(tableId,
                bodyRowTmplId,
                bodyRowTmplHtml,
                bodyTmplHtml) {
        super(tableId);
        this._setupBodyRowTmplHtml(bodyRowTmplId, bodyRowTmplHtml);
        this._setupBodyTmplHtml(bodyTmplHtml);
    }

    /**
     * This is the table row.
     *
     * @param bodyRowTmplId {string}
     * @param bodyRowTmplHtml {string}
     * @protected
     */
    _setupBodyRowTmplHtml(bodyRowTmplId, bodyRowTmplHtml) {
        bodyRowTmplId = !!bodyRowTmplId ? bodyRowTmplId : `${this.tableId}RowTmpl`;
        if (!!bodyRowTmplHtml) {
            this.bodyRowTmplHtml = bodyRowTmplHtml;
        } else if ($(`#${bodyRowTmplId}`).length) {
            this.bodyRowTmplHtml = HtmlUtils.templateTextOf(bodyRowTmplId);
        }
    }

    /**
     * This is the table body.
     *
     * @param bodyTmplHtml {string}
     * @protected
     */
    _setupBodyTmplHtml(bodyTmplHtml) {
        if (!!bodyTmplHtml) {
            this.bodyTmplHtml = bodyTmplHtml;
        } else if (this.bodyRowTmplHtml) {
            this.bodyTmplHtml = "{{#items}}{{> bodyRow}}{{/items}}";
        }
    }

    renderBodyWithTemplate(data) {
        // return Mustache.render(this.bodyTmplHtml, data, {bodyRow: this.bodyRowTmplHtml})
        Handlebars.registerPartial("bodyRow", this.bodyRowTmplHtml)
        const html = this._renderTemplate(data, this.bodyTmplHtml);
        super.$tbody.html(html);
    }

    /**
     * @param {number|string} [rowDataId]
     * @param {*} [data]
     * @param {string} [rowTmplHtml]
     * @param {boolean} [replaceExisting]
     * @param {"prepend"|"append"} [tableRelativePosition]
     * @param {number} [index]
     * @param {boolean} createIfNotExists
     */
    renderRowWithTemplate({
                              rowDataId,
                              data,
                              rowTmplHtml,
                              replaceExisting,
                              tableRelativePosition,
                              index,
                              createIfNotExists
                          }) {
        const rowHtml = this._renderTemplate(data, rowTmplHtml);
        super.renderRow({
            rowDataId,
            rowHtml,
            replaceExisting,
            tableRelativePosition,
            index,
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