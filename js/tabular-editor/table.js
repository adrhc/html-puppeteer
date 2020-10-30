class Table {
    constructor(tableId) {
        this.tableElem = document.getElementById(tableId);
        this.tbody = this.tableElem.tBodies[0]; // HTMLTableSectionElement
    }

    deleteAllRows() {
        while (this.tbody.rows.length) {
            this.tbody.deleteRow(0);
        }
    }

    deleteRow(index) {
        this.tbody.deleteRow(index);
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

    /**
     * @param index
     * @returns {*|HTMLTableRowElement|string}
     */
    getRowAt(index) {
        return this.tbody.rows[index];
    }
}
