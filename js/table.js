const DATA = [
    {code: "1235646565", name: "Stuff"},
    {code: "0384928528", name: "Acme Kidney Beans 2"}
]

class Table {
    constructor(tableId, rowTemplateId, editorTemplateId) {
        this.tableElem = document.getElementById(tableId);
        this.tbody = this.tableElem.tBodies[0]; // HTMLTableSectionElement
        this.rowTemplateContent = document.getElementById(rowTemplateId).content;
        this.editorTemplateContent = document.getElementById(editorTemplateId).content;
        this.rowTemplateElem = this.rowTemplateContent.firstElementChild;
        this.editorTemplateElem = this.editorTemplateContent.firstElementChild;
    }

    insertRow(index) {
        const row = this.tbody.insertRow(index);
        const clone = this.editorTemplateElem.cloneNode(true);
        row.appendChild(clone);
    }

    addRow() {
        // Clone the new row and insert it into the table
        const clone = this.rowTemplateElem.cloneNode(true);
        // const clone = rowTemplateContent.cloneNode(true);
        // console.log(clone);
        const td = clone.querySelectorAll("td");
        [...arguments].forEach((_, i) => td[i].textContent = arguments[i]);
        this.tbody.appendChild(clone);
    };
}
