class EntityView {
    constructor(table, editIndex) {
        this.table = table;
        this.editIndex = editIndex;
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
}