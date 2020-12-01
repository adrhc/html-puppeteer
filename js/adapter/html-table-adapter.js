/**
 * Role: adapter to HTMLTableElement
 */
class HtmlTableAdapter {
    constructor(tableId, bodyTmpl, elemTmpl) {
        this.tableId = tableId;
        this.bodyTmpl = bodyTmpl;
        this.elemTmpl = elemTmpl;
    }

    deleteRow(index) {
        this.$tbody().find(`tr:eq(${index})`).remove();
    }

    deleteAllRows() {
        this.$tbody().empty();
    }

    $tbody() {
        return $(`#${this.tableId} > tbody`);
    }

    renderBody(data) {
        const bodyTmplHtml = HtmlUtils.prototype.templateTextOf(this.bodyTmpl);
        const elemTmplHtml = $(`#${this.elemTmpl}`).html();
        const html = Mustache.render(bodyTmplHtml, data, {readOnlyRow: elemTmplHtml})
        this.$tbody().html(html);
    }

    /**
     * @param index: row index
     * @param data: row cell values
     * @param rowTmpl: row HTML template
     * @param replaceExisting: whether to replace or append a new row
     */
    renderRow(index, data, rowTmpl, replaceExisting) {
        const renderedHtml = MustacheUtils.prototype.renderTmplId(data, rowTmpl)
        const $rowAtIndex = this.$tbody().find("tr").eq(index);
        if (replaceExisting) {
            $rowAtIndex.replaceWith(renderedHtml);
        } else {
            const row = $(renderedHtml);
            if ($rowAtIndex.length) {
                $rowAtIndex.before(row);
            } else {
                this.$tbody().append(row);
            }
        }
    }
}
