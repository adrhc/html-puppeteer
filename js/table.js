class Table {
    constructor(tableId) {
        this.tableElem = document.getElementById(tableId);
        this.tbody = this.tableElem.tBodies[0]; // HTMLTableSectionElement
    }

    deleteRow(index) {
        this.tbody.deleteRow(index);
    }

    insertRow(index, rowTemplateElem, cellData) {
        const rowClone = rowTemplateElem.cloneNode(true);
        const row = this.tbody.insertRow(index);
        for (let i = 0; i < rowTemplateElem.childElementCount; i++) {
            // alternative 1
            // const cell = row.insertCell();
            // const field = rowTemplateElem.children[i].firstElementChild.cloneNode(true);
            // field.value = cellData[field.name];
            // cell.appendChild(field);

            // alternative 2
            row.append(...rowClone.childNodes.values());
        }
        for (let p in cellData) {
            if (!cellData.hasOwnProperty(p)) {
                continue;
            }
            const cell = row.cells.namedItem(p);
            if (!cell) {
                continue;
            }
            cell.children.namedItem(p).value = cellData[p];
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
