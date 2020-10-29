class MainView {
    constructor(data) {
        this.data = data;
        this.table = new Table("producttable");
        this.rowTemplateContent = document.getElementById("productrow").content;
        this.rowTemplateElem = this.rowTemplateContent.firstElementChild;
        this.editorTemplateContent = document.getElementById("editor").content;
    }

    setRowEventHandlers(row) {
        row.ondblclick = () => this.activateEditor(row);
    }

    showReadOnlyCell(cell, rowData) {
        cell.textContent = rowData[cell.dataset['name']];
    }

    showEditableCell(cell, rowData) {
        cell.firstElementChild.value = rowData[cell.firstElementChild.name];
    }

    deactivateEditor() {
        if (this.editIndex == null || this.editIndex < 0) {
            return;
        }
        this.table.deleteRow(this.editIndex);
        const rowData = this.data[this.editIndex];
        this.table.insertRow(this.editIndex, this.rowTemplateElem,
            (cell) => this.showReadOnlyCell(cell, rowData),
            this.setRowEventHandlers.bind(this));
    }

    activateEditor(rowElem) {
        this.deactivateEditor();
        this.editIndex = rowElem.rowIndex - 1;
        this.table.deleteRow(this.editIndex);
        const rowData = this.data[this.editIndex];
        this.table.insertRow(this.editIndex, this.editorTemplateContent,
            (cell) => {
                if (cell.firstElementChild) {
                    this.showEditableCell(cell, rowData)
                } else {
                    this.showReadOnlyCell(cell, rowData)
                }
            });
    }

    render() {
        this.data.forEach(it => this.table
            .appendRow(this.rowTemplateElem, it, this.setRowEventHandlers.bind(this)))
    }
}