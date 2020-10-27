class Table {
    constructor(tableId, rowTemplateId) {
        this.tableElem = document.getElementById(tableId);
        this.tbody = this.tableElem.tBodies[0];
        this.rowTemplateId = rowTemplateId;
        this.rowTemplateContent = document.getElementById(rowTemplateId).content;
        this.rowTemplate1thKidElem = this.rowTemplateContent.firstElementChild;
    }

    addRow() {
        // Clone the new row and insert it into the table
        const clone = this.rowTemplate1thKidElem.cloneNode(true);
        // const clone = rowTemplateContent.cloneNode(true);
        // console.log(clone);
        const td = clone.querySelectorAll("td");
        for (let i = 0; i < arguments.length; i++) {
            td[i].textContent = arguments[i];
        }
        this.tbody.appendChild(clone);
    };
}
