class EntityView {
    constructor() {
        this.table = new Table("producttable");
        this.rowTemplateContent = document.getElementById("productrow").content;
        this.rowTemplateElem = this.rowTemplateContent.firstElementChild;
        this.editorTemplateContent = document.getElementById("editor").content;
    }

    createEditor() {
        this.table.insertRow(this.editedPosition, this.editorTemplateContent,
            (cell) => new PropertyView(cell, this.data).showValue());
    }

    createReadOnlyView(eventHandlersConfigurer) {
        this.table.insertRow(this.editedPosition, this.rowTemplateElem,
            (cell) => new PropertyView(cell, this.data).showValue(),
            eventHandlersConfigurer);
    }

    /**
     * the "representation" could be the read-only view or the editor
     */
    removeRepresentation() {
        this.table.deleteRow(this.editedPosition);
    }

    isEditorActive() {
        return this.editedPosition >= 0;
    }

    setEdited(index, data) {
        this.editedPosition = index;
        this.data = data;
    }

    init(data, eventHandlersConfigurer) {
        this.table.appendRow(this.rowTemplateElem, data, eventHandlersConfigurer);
    }
}