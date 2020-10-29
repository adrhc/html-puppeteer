class MainView {
    constructor(data) {
        this.data = data;
        this.table = new Table("producttable");
        this.entityView = new EntityView(this.table);
        this.rowTemplateContent = document.getElementById("productrow").content;
        this.rowTemplateElem = this.rowTemplateContent.firstElementChild;
        this.editorTemplateContent = document.getElementById("editor").content;
    }

    configureEventHandlers(row) {
        row.ondblclick = () => this.activateEditor(row);
    }

    deactivateEditor() {
        if (!this.isEditorActive()) {
            return;
        }
        // remove the editor
        this.removeEntityRepresentation();
        this.createEntityView();
    }

    activateEditor(rowElem) {
        this.deactivateEditor();
        this.editIndex = rowElem.rowIndex - 1;
        // remove the entity's read-only view
        this.removeEntityRepresentation();
        this.createEditor();
    }

    createEditor() {
        this.table.insertRow(this.editIndex, this.editorTemplateContent,
            (cell) => new PropertyView(cell, this.getEditedData()).showValue());
    }

    createEntityView() {
        this.table.insertRow(this.editIndex, this.rowTemplateElem,
            (cell) => new PropertyView(cell, this.getEditedData()).showValue(),
            this.configureEventHandlers.bind(this));
    }

    /**
     * the "representation" could be the read-only view or the editor
     */
    removeEntityRepresentation() {
        this.table.deleteRow(this.editIndex);
    }

    getEditedData() {
        return this.data[this.editIndex];
    }

    isEditorActive() {
        return this.editIndex >= 0;
    }

    render() {
        this.data.forEach(it => this.table
            .appendRow(this.rowTemplateElem, it, this.configureEventHandlers.bind(this)))
    }
}