class Table {
    constructor(tableId) {
        this.tableElem = document.getElementById(tableId);
        this.tbody = this.tableElem.tBodies[0]; // HTMLTableSectionElement
    }

    deleteRow(index) {
        this.tbody.deleteRow(index);
    }

    insertRow(index, cellsContainerTmpl, cellManipulator, rowManipulator) {
        const cellsCTEClone = cellsContainerTmpl.cloneNode(true);
        const row = this.tbody.insertRow(index);
        if (rowManipulator) {
            rowManipulator(row);
        }
        // filling the row
        for (let i = 0; i < cellsContainerTmpl.childElementCount; i++) {
            row.append(...cellsCTEClone.childNodes.values());
        }
        // filling the cell/field values
        for (let i = 0; i < row.cells.length; i++) {
            const cell = row.cells[i];
            cellManipulator(cell);
        }
    }

    appendRow(rowTmpl, cellData, rowManipulator) {
        // Clone the new row and insert it into the table
        const rowClone = rowTmpl.cloneNode(true);
        if (rowManipulator) {
            rowManipulator(rowClone);
        }
        const cellDataArray = [...Object.values(cellData)];
        cellDataArray.forEach((_, i) => rowClone.cells[i].textContent = cellDataArray[i]);
        this.tbody.appendChild(rowClone);
    };
}
