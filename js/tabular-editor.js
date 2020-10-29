class TabularEditor {
    constructor(data) {
        this.data = data;
        this.entityView = new EntityView();
    }

    deactivateEditor() {
        if (!this.entityView.isEditorActive()) {
            return;
        }
        // remove the editor
        this.entityView.removeRepresentation();
        this.entityView.createReadOnlyView(this.configureEventHandlers.bind(this));
    }

    activateEditor(rowElem) {
        this.deactivateEditor();
        const editIndex = rowElem.rowIndex - 1;
        this.entityView.setEdited(editIndex, this.data[editIndex]);
        // remove the entity's read-only view
        this.entityView.removeRepresentation();
        this.entityView.createEditor();
    }

    init() {
        this.data.forEach(d => this.entityView.init(d, this.configureEventHandlers.bind(this)))
    }

    configureEventHandlers(row) {
        row.ondblclick = () => this.activateEditor(row);
    }
}