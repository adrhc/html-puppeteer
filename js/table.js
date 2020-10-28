class Table {
    constructor(tableId) {
        this.tableElem = document.getElementById(tableId);
        this.tbody = this.tableElem.tBodies[0]; // HTMLTableSectionElement
    }

    deleteRow(index) {
        this.tbody.deleteRow(index);
    }

    insertRow(index, rowTemplateElem, cellDataLoader) {
        const rowClone = rowTemplateElem.cloneNode(true);
        const row = this.tbody.insertRow(index);
        // todo: copy the ondblclick from template
        // row.ondblclick = eval(rowClone.getAttribute('ondblclick'));
        // filling the row
        for (let i = 0; i < rowTemplateElem.childElementCount; i++) {
            row.append(...rowClone.childNodes.values());
        }
        // filling the cell/field values
        for (let i = 0; i < row.cells.length; i++) {
            const cell = row.cells[i];
            cellDataLoader(cell);
        }
    }

    appendRow(rowTemplateElem, ...cellData) {
        // Clone the new row and insert it into the table
        const clone = rowTemplateElem.cloneNode(true);
        // const clone = rowTemplateContent.cloneNode(true);
        // console.log(clone);
        const td = clone.querySelectorAll("td");
        cellData.forEach((_, i) => td[i].textContent = cellData[i]);
        this.tbody.appendChild(clone);
    };
}
