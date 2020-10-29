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

    cancelEdit() {
        if (!this.editIndex) {
            return;
        }
        this.table.deleteRow(this.editIndex);
        const cellData = this.data[this.editIndex];
        this.table.insertRow(this.editIndex, this.rowTemplateElem,
            (cell) => cell.textContent = cellData[cell.dataset['name']],
            this.setRowEventHandlers.bind(this));
    }

    activateEditor(rowElem) {
        this.cancelEdit();
        this.editIndex = rowElem.rowIndex - 1;
        this.table.deleteRow(this.editIndex);
        const cellData = this.data[this.editIndex];
        this.table.insertRow(this.editIndex, this.editorTemplateContent,
            (cell) => cell.firstElementChild.value = cellData[cell.firstElementChild.name]);
    }

    render() {
        this.data.forEach(it => this.table
            .appendRow(this.rowTemplateElem, it, this.setRowEventHandlers.bind(this)))
    }
}