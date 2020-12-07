/**
 * Role: adapter to HTMLTableElement
 */
class TableElementAdapter {
    constructor(tableId) {
        this.tableId = tableId;
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

    $getRowById(rowId) {
        return this.$tbody.find(`#${rowId}`);
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

    get columnsCount() {
        let columnsCount = 0;
        const firstRow = $(`#${this.tableId} tr:nth-child(1)`);
        let tds = firstRow.find("th");
        if (!tds.length) {
            tds = firstRow.find("td");
        }
        for (let td of tds) {
            const colspan = $(td).attr('colspan');
            if (colspan) {
                columnsCount += +colspan;
            } else {
                columnsCount++;
            }
        }
        return columnsCount;
    }

    get $tbody() {
        const $tbody = this._$tbody;
        if (!$tbody.length) {
            return this.$table.append("<tbody></tbody>").find("tbody");
        }
        return this._$tbody;
    }

    get $table() {
        return $(this.tableId);
    }

    get _$tbody() {
        return $(`#${this.tableId} > tbody`);
    }
}
