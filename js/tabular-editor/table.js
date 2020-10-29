class Table {
    constructor(tableId) {
        this.tableElem = document.getElementById(tableId);
        this.tbody = this.tableElem.tBodies[0]; // HTMLTableSectionElement
    }

    deleteRow(index) {
        this.tbody.deleteRow(index);
    }

    insertRow(index, cellsContainerTmpl, cellManipulator, rowManipulator) {
        const cellsCTClone = cellsContainerTmpl.cloneNode(true);
        const row = this.tbody.insertRow(index);
        if (rowManipulator) {
            rowManipulator(row);
        }
        // filling the row with nodes from template
        row.append(...cellsCTClone.childNodes.values());
        // setting the values for cells or fields inside them (if any)
        for (let i = 0; i < row.cells.length; i++) {
            cellManipulator(row.cells[i]);
        }
    }
}
