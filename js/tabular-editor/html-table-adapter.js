/**
 * Role: adapter to HTMLTableElement
 */
class HtmlTableAdapter {
    constructor(tableId) {
        this.tableId = tableId;
        this.tbody = this.tBody()[0];
    }

    /**
     * @param index
     * @param rowTemplateId
     * @returns {HTMLTableRowElement}
     */
    createRow(index, rowTemplateId) {
        const row = this.tbody.insertRow(index);
        row.innerHTML = $(`#${rowTemplateId}`).html();
        return row;
    }

    deleteRow(index) {
        this.tbody.deleteRow(index);
    }

    deleteAllRows() {
        this.tBody().empty();
    }

    /**
     * @param rowIndex
     * @returns {*|HTMLTableRowElement|string}
     */
    getRowAt(rowIndex) {
        return this.tbody.rows[rowIndex];
    }

    /**
     * private
     */
    tBody() {
        return $(`#${this.tableId} > tbody`);
    }
}
