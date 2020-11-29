/**
 * Role: adapter to HTMLTableElement
 */
class HtmlTableAdapter {
    constructor(tableId, bodyTmpl) {
        this.tableId = tableId;
        this.bodyTmpl = bodyTmpl;
    }

    deleteRow(index) {
        this.tbody().find(`tr:eq(${index})`).remove();
    }

    deleteAllRows() {
        this.tbody().empty();
    }

    tbody() {
        return $(`#${this.tableId} > tbody`);
    }

    renderBody(data) {
        const bodyTmplHtml = $(`#${this.bodyTmpl}`).html();
        const renderedHtml = Mustache.render(bodyTmplHtml, data)
        this.tbody().html(renderedHtml);
    }

    /**
     * @param index: row index
     * @param data: row cell values
     * @param rowTmpl: row HTML template
     * @param replaceExisting: whether to replace or append a new row
     */
    renderRow(index, data, rowTmpl, replaceExisting) {
        const rowTmplHtml = $(`#${rowTmpl}`).html();
        const renderedHtml = Mustache.render(rowTmplHtml, data)
        const $rowAtIndex = this.tbody().find("tr").eq(index);
        if (replaceExisting) {
            $rowAtIndex.replaceWith(renderedHtml);
        } else {
            const row = $(renderedHtml);
            if ($rowAtIndex.length) {
                $rowAtIndex.before(row);
            } else {
                this.tbody().append(row);
            }
        }
    }
}
