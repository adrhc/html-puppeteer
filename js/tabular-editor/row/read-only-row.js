class ReadOnlyRow extends SelectableRow {
    constructor(tabularEditorState, table, readOnlyRowTemplate) {
        super(tabularEditorState, table, readOnlyRowTemplate);
    }

    render(eventHandlersConfigurer) {
        this.table.insertRow(this.context.selectedIndex, this.tmplContent.firstElementChild,
            this.renderCell.bind(this), eventHandlersConfigurer);
    }

    renderCell(cell) {
        cell.textContent = this.rowData[cell.dataset['name']];
    }
}