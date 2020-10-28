class MainView {
    constructor(data) {
        this.data = data;
        this.table = new Table("producttable");
        this.rowTemplateContent = document.getElementById("productrow").content;
        this.rowTemplateElem = this.rowTemplateContent.firstElementChild;
        this.editorTemplateContent = document.getElementById("editor").content;
    }

    cancelEdit() {
        if (!this.editIndex) {
            return;
        }
        this.table.deleteRow(this.editIndex);
        this.table.insertRow(this.editIndex, this.rowTemplateElem, this.data[this.editIndex]);
    }

    activateEditor(rowElem) {
        this.cancelEdit();
        this.editIndex = rowElem.rowIndex - 1;
        this.table.deleteRow(this.editIndex);
        this.table.insertRow(this.editIndex, this.editorTemplateContent, this.data[this.editIndex]);
    }

    render() {
        this.data.forEach(it => this.table.appendRow(this.rowTemplateElem, ...Object.values(it)))
    }
}