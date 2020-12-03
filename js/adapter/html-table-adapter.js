/**
 * Role: adapter to HTMLTableElement
 */
class HtmlTableAdapter {
    constructor(tableId, bodyTmpl, elemTmpl) {
        this.tableId = tableId;
        this.bodyTmpl = bodyTmpl;
        this.elemTmpl = elemTmpl;
    }

    deleteRowById(id) {
        this.$getRowById(id).remove();
    }

    getRowIndexById(id) {
        const $row = this.$getRowById(id);
        if (!$row.length) {
            return undefined;
        }
        const rowElem = this.$getRowById(id)[0];
        return rowElem.sectionRowIndex == null ? rowElem.rowIndex : rowElem.sectionRowIndex;
    }

    $getRowById(id) {
        return this.$tbody().find(`#${id}`);
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
        const rowHtml = data ? MustacheUtils.prototype.renderTmplId(data, rowTmpl) : $(`#${rowTmpl}`).html();
        const $rowAtIndex = this.$tbody().find("tr").eq(index);
        if (replaceExisting) {
            $rowAtIndex.replaceWith(rowHtml);
        } else {
            const row = $(rowHtml);
            if ($rowAtIndex.length) {
                $rowAtIndex.before(row);
            } else {
                this.$tbody().append(row);
            }
        }
    }
}
