class Table {
    constructor(tableId) {
        this.tableId = tableId;
        this.tbody = this.tBody()[0];
    }

    insertRow(index, cellsContainerTmpl, cellManipulator) {
        const cellsCTClone = cellsContainerTmpl.cloneNode(true);
        const row = this.tbody.insertRow(index);
        // filling the row with nodes from template
        row.append(...cellsCTClone.childNodes.values());
        // setting the values for cells or fields inside them (if any)
        for (let i = 0; i < row.cells.length; i++) {
            cellManipulator(row.cells[i]);
        }
    }

    deleteRow(index) {
        this.tbody.deleteRow(index);
    }

    deleteAllRows() {
        this.tBody().empty();
    }

    /**
     * @param index
     * @returns {*|HTMLTableRowElement|string}
     */
    getRowAt(index) {
        return this.tbody.rows[index];
    }

    /**
     * private
     */
    tBody() {
        return $(`#${this.tableId} > tbody`);
    }
}
