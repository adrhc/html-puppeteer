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
     * @param replaceExisting {boolean}: whether to replace or append a new row
     * @param putAtBottomIfNotExists {boolean}
     */
    renderRowBeforeDataId(rowDataId, rowHtml, replaceExisting, putAtBottomIfNotExists) {
        const $existingRow = this.$getRowByDataId(rowDataId);
        this._replaceOrCreateRow($existingRow,
            rowHtml ? rowHtml : this.emptyRowHtmlOf(rowDataId),
            'before', replaceExisting, putAtBottomIfNotExists);
    }

    /**
     * @param rowDataId {string|number}
     * @param rowHtml {string}
     * @param replaceExisting {boolean}: whether to replace or append a new row
     * @param putAtBottomIfNotExists {boolean}
     */
    renderRowAfterDataId(rowDataId, rowHtml, replaceExisting, putAtBottomIfNotExists) {
        const $existingRow = this.$getRowByDataId(rowDataId);
        this._replaceOrCreateRow($existingRow,
            rowHtml ? rowHtml : this.emptyRowHtmlOf(rowDataId),
            'after', replaceExisting, putAtBottomIfNotExists);
    }

    /**
     * @param index {number}: row index
     * @param rowHtml {string}: row HTML
     * @param replaceExisting {boolean}: whether to replace or append a new row
     * @param putAtBottomIfNotExists {boolean}
     */
    renderRowAtIndex(index, rowHtml, replaceExisting, putAtBottomIfNotExists) {
        const $existingRow = this.$getRowAtIndex(index);
        this._replaceOrCreateRow($existingRow, rowHtml, 'before', replaceExisting, putAtBottomIfNotExists);
    }

    /**
     * @param $existingRow {jQuery<HTMLTableRowElement>} is the row relative to which the generated one will be placed
     * @param rowHtml {string} is the "generated row"
     * @param replaceExisting {boolean} specify that the generated row will replace the existing one
     * @param where {'before', 'after'} specify where to put the generated row relative to the existing one
     * @param putAtBottomIfNotExists {boolean} specify the that generated row should be put at bottom of the table if $existingRow is missing
     * @protected
     */
    _replaceOrCreateRow($existingRow, rowHtml, where, replaceExisting, putAtBottomIfNotExists) {
        if ($existingRow.length) {
            if (replaceExisting) {
                $existingRow.replaceWith(rowHtml);
            } else {
                $existingRow[where]($(rowHtml));
            }
        } else {
            if (putAtBottomIfNotExists) {
                this.$tbody.append($(rowHtml));
            } else {
                this.$tbody.prepend($(rowHtml));
            }
        }
    }

    /**
     * @param rowDataId {string}
     * @param append {boolean}
     */
    showEmptyRow(rowDataId, append) {
        if (append) {
            return this.$tbody.append(this.emptyRowHtmlOf(rowDataId));
        } else {
            return this.$tbody.prepend(this.emptyRowHtmlOf(rowDataId));
        }
    }

    emptyRowHtmlOf(rowDataId) {
        return `<tr data-owner='${this.tableId}' data-id='${rowDataId}'></tr>`;
    }

    /**
     * @return {jQuery<HTMLTableRowElement>[]}
     */
    $getAllRows() {
        return this.$tbody.children(`tr${this.ownerSelector}`);
    }

    /**
     * @param rowDataId
     * @return {jQuery<HTMLTableRowElement>}
     */
    $getRowByDataId(rowDataId) {
        return this.$tbody.children(this.getRowSelector(rowDataId));
    }

    getRowSelector(rowDataId) {
        return `tr${this.ownerSelector}[data-id='${rowDataId}']`;
    }

    get ownerSelector() {
        return `[data-owner='${this.tableId}']`;
    }

    /**
     * @param index
     * @return {jQuery<HTMLTableRowElement>}
     */
    $getRowAtIndex(index) {
        return this.$tbody.children(`tr:eq(${index})`);
    }

    get columnsCount() {
        let columnsCount = 0;
        const firstRow = $(`#${this.tableId} tr:nth-child(1)`);
        if (!firstRow.length) {
            const tableColumnsCount = this.$table.data("columns-count");
            return tableColumnsCount ? +tableColumnsCount : 1; // default to 1 column
        }
        let tds = firstRow.children("th");
        if (!tds.length) {
            tds = firstRow.children("td");
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
            return this.$table.append("<tbody></tbody>").children("tbody");
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
