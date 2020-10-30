class ReadOnlyRow extends SelectableRow {
    constructor(index, values, table, readOnlyRowTemplate) {
        super(index, values, table, readOnlyRowTemplate);
    }

    render() {
        this.table.insertRow(this.index,
            this.tmplContent.firstElementChild, this.renderCell.bind(this));
    }

    renderCell(cell) {
        cell.textContent = this.values[this.nameOf(cell)];
    }
}