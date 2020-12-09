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
        // rowElem.sectionRowIndex doesn't play well with jquery tr:eq(${index})
        // return rowElem.sectionRowIndex == null ? rowElem.rowIndex : rowElem.sectionRowIndex;
        return rowElem.rowIndex;
    }

    /**
     * @param rowDataId {string|number}
     * @param rowHtml {string}
     * @param replaceExistingIfExists {boolean}: whether to replace or append a new row
     */
    renderRowBeforeDataId(rowDataId, rowHtml, replaceExistingIfExists) {
        const $existingRow = this.$getRowByDataId(rowDataId);
        this._replaceOrCreateRow($existingRow, rowHtml, 'before', replaceExistingIfExists);
    }

    /**
     * @param rowDataId {string|number}
     * @param rowHtml {string}
     * @param replaceExistingIfExists {boolean}: whether to replace or append a new row
     */
    renderRowAfterDataId(rowDataId, rowHtml, replaceExistingIfExists) {
        const $existingRow = this.$getRowByDataId(rowDataId);
        this._replaceOrCreateRow($existingRow, rowHtml, 'after', replaceExistingIfExists);
    }

    /**
     * @param index {number}: row index
     * @param rowHtml {string}: row HTML
     * @param replaceExistingIfExists {boolean}: whether to replace or append a new row
     */
    renderRowAtIndex(index, rowHtml, replaceExistingIfExists) {
        const $existingRow = this.$getRowAtIndex(index);
        this._replaceOrCreateRow($existingRow, rowHtml, 'before', replaceExistingIfExists);
    }

    /**
     * @param $existingRow
     * @param rowHtml
     * @param replaceExistingIfExists
     * @param where {'before', 'after'}
     * @private
     */
    _replaceOrCreateRow($existingRow, rowHtml, where, replaceExistingIfExists) {
        if ($existingRow.length) {
            if (replaceExistingIfExists) {
                $existingRow.replaceWith(rowHtml);
            } else {
                $existingRow[where]($(rowHtml));
            }
        } else {
            this.$tbody.append($(rowHtml));
        }
    }

    /**
     * @param rowDataId
     * @return {jQuery}
     */
    prependEmptyRow(rowDataId) {
        return this.$tbody.prepend(`<tr data-owner='${this.tableId}' data-id='${rowDataId}'></tr>`);
    }

    /**
     * @param rowDataId
     * @return {jQuery<HTMLTableRowElement>}
     */
    $getRowByDataId(rowDataId) {
        return this.$tbody.find(`[data-owner='${this.tableId}'][data-id='${rowDataId}']`);
    }

    /**
     * @param index
     * @return {jQuery<HTMLTableRowElement>}
     */
    $getRowAtIndex(index) {
        return this.$tbody.find(`tr:eq(${index})`);
    }

    get columnsCount() {
        let columnsCount = 0;
        const firstRow = $(`#${this.tableId} tr:nth-child(1)`);
        if (!firstRow.length) {
            const tableColumnsCount = this.$table.data("columns-count");
            return tableColumnsCount ? +tableColumnsCount : 1; // default to 1 column
        }
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
        return $tbody;
    }

    get $table() {
        return $(`#${this.tableId}`);
    }

    get _$tbody() {
        return $(`#${this.tableId} > tbody`);
    }
}
