/**
 * Role: adapter to HTMLTableElement
 */
class HtmlTableAdapter {
    constructor(tableId, bodyRowTmplId, bodyTmplHtml) {
        this.tableId = tableId;
        this.bodyRowTmplHtml = $(`#${bodyRowTmplId}`).html()
        this.bodyTmplHtml = bodyTmplHtml ? bodyTmplHtml : "{{#items}}{{> readOnlyRow}}{{/items}}";
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
        return this.$tbody.find(`#${id}`);
    }

    get $tbody() {
        const $tbody = this._$tbody;
        if (!$tbody.length) {
            return this.$table.append("<tbody></tbody>").find("tbody");
        }
        return this._$tbody;
    }

    renderBody(data) {
        const html = Mustache.render(this.bodyTmplHtml, data, {readOnlyRow: this.bodyRowTmplHtml})
        this.$tbody.html(html);
    }

    /**
     * @param index {number}: row index
     * @param rowHtml {string}: row HTML
     * @param replaceExisting {boolean}: whether to replace or append a new row
     */
    renderRow(index, rowHtml, replaceExisting) {
        const $rowAtIndex = this.$tbody.find("tr").eq(index);
        if (replaceExisting) {
            $rowAtIndex.replaceWith(rowHtml);
        } else {
            const $row = $(rowHtml);
            if ($rowAtIndex.length) {
                $rowAtIndex.before($row);
            } else {
                this.$tbody.append($row);
            }
        }
    }

    get $table() {
        return $(`#${this.tableId}`);
    }

    get _$tbody() {
        return $(`#${this.tableId} > tbody`);
    }
}
