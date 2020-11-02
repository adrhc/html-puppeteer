/**
 * Role: adapter to HTMLTableElement
 */
class HtmlTableAdapter {
    constructor(tableId) {
        this.tableId = tableId;
        this.tbody = this.tBody(0);
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
     * private
     */
    tBody(index) {
        if (index >= 0) {
            return $(`#${this.tableId} > tbody`)[index];
        } else {
            return $(`#${this.tableId} > tbody`);
        }
    }
}
