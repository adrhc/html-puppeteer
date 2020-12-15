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

    /**
     * @param rowDataId {string|number}
     * @param rowHtml {string}
     * @param replaceExisting {boolean}: whether to replace or append a new row
     * @param putAtBottomIfNotExists {boolean}
     */
    renderRowBeforeDataId(rowDataId, rowHtml, replaceExisting, putAtBottomIfNotExists) {
        this.renderRow({
            rowDataId,
            rowHtml: rowHtml ? rowHtml : this.emptyRowHtmlOf(rowDataId),
            replaceExisting,
            tableRelativePosition: putAtBottomIfNotExists ? "append" : "prepend",
            createIfNotExists: true
        });
    }

    /**
     * @param rowDataId {number|string}
     * @param rowHtml {string}
     * @param replaceExisting {boolean|undefined}
     * @param neighbourRowDataId {number|string}
     * @param neighbourRelativePosition {"before"|"after"|undefined}
     * @param tableRelativePosition {"prepend"|"append"|undefined}
     * @param createIfNotExists {boolean|undefined}
     */
    renderRow({
                  rowDataId,
                  rowHtml,
                  replaceExisting,
                  neighbourRowDataId,
                  neighbourRelativePosition = "before",
                  tableRelativePosition = "prepend",
                  createIfNotExists
              }) {
        const $existingRow = this.$getRowByDataId(rowDataId);
        if ($existingRow.length) {
            if (replaceExisting) {
                // replace existing
                $existingRow.replaceWith(rowHtml);
            }
        } else if (createIfNotExists) {
            if (neighbourRowDataId) {
                const $neighbour = this.$getRowByDataId(neighbourRowDataId);
                $neighbour[neighbourRelativePosition]($(rowHtml));
            } else if (tableRelativePosition) {
                this.$tbody[tableRelativePosition]($(rowHtml));
            }
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
