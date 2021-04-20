/**
 * Defaults:
 *
 * tableId = tableId or $table.data("id") or $table.attr("id")
 * bodyRowTmplId = bodyRowTmplId or ${tableId}RowTmpl
 */
class MustacheTableElemAdapter extends TableElementAdapter {
    /**
     * @param {string|jQuery<HTMLTableRowElement>} tableId
     * @param {string} bodyRowTmplId
     * @param {string} [bodyRowTmplHtml]
     * @param {string} [bodyTmplHtml]
     * @param {string} rowDataId
     * @param [rowPositionOnCreate]
     */
    constructor(tableId, {
        bodyRowTmplId,
        bodyRowTmplHtml,
        bodyTmplHtml,
        rowDataId,
        rowPositionOnCreate
    } = {}) {
        super(tableId, {
            rowDataId,
            rowPositionOnCreate
        });
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
        if (bodyRowTmplHtml) {
            this.bodyRowTmplHtml = bodyRowTmplHtml;
        } else if ($(`#${bodyRowTmplId}`).length) {
            this.bodyRowTmplHtml = HtmlUtils.templateTextOf(bodyRowTmplId);
        } else {
            this.bodyRowTmplHtml = DomUtils.htmlIncludingSelfOf(this.$bodyRowTmpl);
        }
    }

    /**
     * @return {jQuery<HTMLTableRowElement>} the row template for this table
     */
    get $bodyRowTmpl() {
        return super.$firstRow;
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
     * @param {EntityRow} [rowValues]
     * @param {string} [rowTmplHtml]
     * @param {boolean} [replaceExisting]
     * @param {boolean} createIfNotExists
     */
    renderRowWithTemplate({
                              rowDataId,
                              rowValues,
                              rowTmplHtml,
                              replaceExisting,
                              createIfNotExists
                          }) {
        const dataToRender = _.defaults({}, rowValues.entity, {[`${JQueryWidgetsConfig.OWNER_ATTRIBUTE}`]: this.owner});
        const rowHtml = this._renderTemplate(dataToRender, rowTmplHtml);
        super.renderRow({
            rowDataId,
            rowHtml,
            replaceExisting,
            rowValues,
            createIfNotExists
        });
    }

    /**
     * @param {{}} data
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