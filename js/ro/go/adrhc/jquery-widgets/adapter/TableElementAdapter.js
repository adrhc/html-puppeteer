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
     * @returns {jQuery<HTMLTableRowElement>}
     */
    get $firstRow() {
        return this.$rowByIndex(1);
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
     * @returns {jQuery<HTMLBodyElement>}
     */
    get _$tbody() {
        return this.$table.children("tbody");
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
     * @type {string}
     * @private
     */
    _tableId;

    get tableId() {
        return this._tableId;
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
     * @returns {string}
     */
    get ownerSelector() {
        return `[data-${JQueryWidgetsConfig.OWNER_ATTRIBUTE}='${this.owner}']`;
    }

    get rowsCount() {
        return $("tr", this.$tbody).length;
    }

    /**
     * @param {Object} options
     * @param {string|jQuery<HTMLTableRowElement>} options.elemIdOrJQuery
     * @param {string=} options.rowDataId
     * @param {string=} options.rowPositionOnCreate
     */
    constructor({elemIdOrJQuery, rowDataId, rowPositionOnCreate}) {
        this.rowDataId = rowDataId ?? "id";
        this.rowPositionOnCreate = rowPositionOnCreate ?? "prepend";
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
     * @param {string} newRowHtml
     * @param {number|string} rowToReplaceId
     */
    replaceRow(newRowHtml, rowToReplaceId) {
        this.$getRowByDataId(rowToReplaceId).replaceWith(newRowHtml);
    }

    /**
     * @param {string} newRowHtml
     * @param {{index?: undefined|number, beforeRowId?: undefined|number, afterRowId?: undefined|number, append?: undefined|boolean}} rowPosition
     */
    createRow(newRowHtml, rowPosition) {
        const $row = $(newRowHtml);
        if (rowPosition.beforeRowId != null) {
            this.$getRowByDataId(rowPosition.beforeRowId).before($row);
        } else if (rowPosition.afterRowId != null) {
            this.$getRowByDataId(rowPosition.afterRowId).after($row);
        } else if (rowPosition.append != null) {
            this.$tbody[rowPosition.append ? "append" : "prepend"]($row);
        } else if (rowPosition.index != null) {
            console.warn("index is not reliable, don't use it!\n", rowPosition);
            $(`tr:eq(${rowPosition.index - 1})`, this.$tbody).after($row);
        } else {
            console.error(`don't use "rowPositionOnCreate" (${this.rowPositionOnCreate})!\n`, rowPosition);
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
}
