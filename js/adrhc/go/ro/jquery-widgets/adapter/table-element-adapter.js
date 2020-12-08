/**
 * Role: adapter to HTMLTableElement
 */
class TableElementAdapter {
    constructor(tableId) {
        this.tableId = tableId;
    }

    deleteRowByDataId(rowDataId) {
        this.$getRowByDataId(rowDataId).remove();
    }

    getRowIndexByDataId(rowDataId) {
        const $row = this.$getRowByDataId(rowDataId);
        if (!$row.length) {
            return undefined;
        }
        const rowElem = this.$getRowByDataId(rowDataId)[0];
        return rowElem.sectionRowIndex == null ? rowElem.rowIndex : rowElem.sectionRowIndex;
    }

    /**
     * @param index {number}: row index
     * @param rowHtml {string}: row HTML
     * @param replaceExisting {boolean}: whether to replace or append a new row
     */
    renderRow(index, rowHtml, replaceExisting) {
        const $rowAtIndex = this.$getRowAtIndex(index);
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

    /**
     * @param rowDataId
     * @return {jQuery<HTMLTableRowElement>}
     */
    $getRowByDataId(rowDataId) {
        return this.$tbody.find(`[data-id='${rowDataId}']`);
    }

    /**
     * @param index
     * @return {jQuery<HTMLTableRowElement>}
     */
    $getRowAtIndex(index) {
        return this.$tbody.find("tr").eq(index);
    }

    get columnsCount() {
        let columnsCount = 0;
        const firstRow = $(`#${this.tableId} tr:nth-child(1)`);
        let tds = firstRow.find("th");
        if (!tds.length) {
            tds = firstRow.find("td");
        }
        if (!tds.length) {
            return +$table.data("columns-count");
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
        return $(`#${this.tableId}`);
    }

    get _$tbody() {
        return $(`#${this.tableId} > tbody`);
    }
}
