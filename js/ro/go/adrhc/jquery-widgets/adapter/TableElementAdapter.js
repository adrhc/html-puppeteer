/**
 * Role: adapter to HTMLTableElement
 */
class TableElementAdapter {
    /**
     * @type {string}
     */
    rowDataId;
    /**
     * @type {"prepend"|"append"}
     */
    rowPositionOnCreate;

    /**
     * @param {Object} params
     * @param {string|jQuery<HTMLTableRowElement>} params.elemIdOrJQuery
     * @param {string=} params.rowDataId
     * @param {string=} params.rowPositionOnCreate
     */
    constructor({
                    elemIdOrJQuery,
                    rowDataId = "id",
                    rowPositionOnCreate = "prepend"
                } = {
        rowDataId: "id",
        rowPositionOnCreate: "prepend"
    }) {
        this.rowDataId = rowDataId;
        this.rowPositionOnCreate = rowPositionOnCreate;
        this._setupElem(elemIdOrJQuery);
        this._setupTableId();
        this._setupOwner();
    }

    /**
     * @param tableId {string|jQuery<HTMLTableRowElement>}
     * @protected
     */
    _setupElem(tableId) {
        if (tableId instanceof jQuery) {
            this._$table = tableId;
        } else {
            this._$table = $(`#${tableId}`);
        }
    }

    _setupTableId() {
        const dataId = this.$table.data(this.rowDataId);
        this._tableId = dataId ? dataId : this.$table.attr(this.rowDataId);
    }

    /**
     * @protected
     */
    _setupOwner() {
        const dataOwner = this.$table.data("owner");
        if (dataOwner) {
            this._owner = dataOwner;
        } else {
            this._owner = this._tableId;
        }
    }

    /**
     * @param {number|string=} rowDataId
     * @param {string=} rowHtml
     * @param {boolean=true} replaceExisting
     * @param {boolean=} removeByIdThenCreateItAgain
     * @param {EntityRow=} rowValues
     * @param {boolean=} createIfNotExists
     */
    renderRow({
                  rowDataId,
                  rowHtml,
                  replaceExisting = true,
                  removeByIdThenCreateItAgain,
                  rowValues,
                  createIfNotExists
              }) {
        rowHtml = rowHtml ? rowHtml : this.emptyRowHtmlOf(rowDataId);
        const $existingRow = rowDataId != null ? this.$getRowByDataId(rowDataId) : {};
        if ($existingRow.length) {
            if (removeByIdThenCreateItAgain) {
                // existing row with the position changed (removing previous position)
                $existingRow.remove();
            } else {
                if (replaceExisting) {
                    // existing row with the position unchanged (replacing previous position)
                    $existingRow.replaceWith(rowHtml);
                }
                return;
            }
        } else if (!createIfNotExists) {
            // not existing row with no permission to create it
            console.warn("not existing row with no permission to create it!\n", rowValues);
            return;
        }
        const $row = $(rowHtml);
        if (rowValues.beforeRowId != null) {
            this.$getRowByDataId(rowValues.beforeRowId).before($row);
        } else if (rowValues.afterRowId != null) {
            this.$getRowByDataId(rowValues.afterRowId).after($row);
        } else if (rowValues.append != null) {
            this.$tbody[rowValues.append ? "append" : "prepend"]($row);
        } else if (rowValues.index != null) {
            console.warn("index is not reliable, don't use it!\n", rowValues);
            $(`tr:eq(${rowValues.index - 1})`, this.$tbody).after($row);
        } else {
            console.error(`don't use "rowPositionOnCreate" (${this.rowPositionOnCreate})!\n`, rowValues);
            this.$tbody[this.rowPositionOnCreate]($row);
        }
    }

    /**
     * @param elem {HTMLElement|jQuery<HTMLElement>}
     * @param [searchParentsForDataIdIfMissingOnElem] {boolean}
     * @return {string|number}
     */
    rowDataIdOf(elem, searchParentsForDataIdIfMissingOnElem) {
        const $elem = elem instanceof jQuery ? elem : $(elem);
        if ($elem.is(this.ownerSelector)) {
            const dataId = $elem.data(this.rowDataId);
            if (dataId != null) {
                return dataId;
            } else if (searchParentsForDataIdIfMissingOnElem) {
                return this.rowDataIdOfParent($elem);
            }
        } else {
            return this.rowDataIdOfParent($elem);
        }
    }

    /**
     * @param elem {HTMLElement|jQuery}
     * @return {string|number}
     */
    rowDataIdOfParent(elem) {
        const $elem = elem instanceof jQuery ? elem : $(elem);
        return $elem.parents(`tr${this.ownerSelector}`).data(this.rowDataId);
    }

    emptyRowHtmlOf(rowDataId) {
        return `<tr data-${JQueryWidgetsConfig.OWNER_ATTRIBUTE}='${this.owner}' data-id='${rowDataId}'></tr>`;
    }

    deleteRowByDataId(rowDataId) {
        this.$getRowByDataId(rowDataId).remove();
    }

    /**
     * @return {jQuery<HTMLTableRowElement>[]}
     */
    $getAllRows() {
        return this.$tbody.children(`tr${this.ownerSelector}`);
    }

    removeAllRows() {
        this.$tbody.children("tr").remove();
    }

    /**
     * @param rowDataId
     * @return {jQuery<HTMLTableRowElement>}
     */
    $getRowByDataId(rowDataId) {
        return this.$getOwnedRowByData(this.rowDataId, rowDataId);
    }

    /**
     * @param dataKey {string}
     * @param dataValue {string|number}
     * @return {jQuery<HTMLTableRowElement>}
     */
    $getOwnedRowByData(dataKey, dataValue) {
        return this.$tbody.children(this.rowSelectorOf(dataValue, dataKey));
    }

    /**
     * @param {string|number|boolean} dataValue
     * @param {string} dataKey
     * @returns {string}
     */
    rowSelectorOf(dataValue, dataKey = this.rowDataId) {
        if (dataValue == null) {
            return `tr${this.ownerSelector}[data-${dataKey}]`;
        } else {
            return `tr${this.ownerSelector}[data-${dataKey}='${dataValue}']`;
        }
    }

    /**
     * @returns {jQuery<HTMLTableRowElement>}
     */
    $rowByIndex(index) {
        const $row = this.$tbody.children(`tr:nth-child(${index})`);
        return $row.length ? $row : undefined;
    }

    /**
     * @returns {jQuery<HTMLTableRowElement>}
     */
    $rowByData(dataName, rowType) {
        const $row = this.$tbody.children(`tr[${dataName}=${rowType}]`);
        return $row.length ? $row : undefined;
    }

    /**
     * @type {jQuery<HTMLTableElement>}
     * @private
     */
    _$table;

    /**
     * @returns {jQuery<HTMLTableElement>}
     */
    get $table() {
        return this._$table;
    }

    /**
     * @type {string}
     * @private
     */
    _tableId;

    get tableId() {
        return this._tableId;
    }

    /**
     * @type {string}
     * @private
     */
    _owner;

    /**
     * @returns {string}
     */
    get owner() {
        return this._owner;
    }

    /**
     * @returns {string}
     */
    get ownerSelector() {
        return `[data-${JQueryWidgetsConfig.OWNER_ATTRIBUTE}='${this.owner}']`;
    }

    get columnsCount() {
        let columnsCount = 0;
        const firstRow = this.$firstRow;
        if (!firstRow) {
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

    /**
     * @returns {jQuery<HTMLBodyElement>}
     */
    get $tbody() {
        if (!this._$tbody.length) {
            this.$table.append("<tbody></tbody>");
        }
        return this._$tbody;
    }

    /**
     * @returns {jQuery<HTMLBodyElement>}
     */
    get _$tbody() {
        return this.$table.children("tbody");
    }

    /**
     * @returns {jQuery<HTMLTableRowElement>}
     */
    get $firstRow() {
        return this.$rowByIndex(1);
    }
}
