class PropertyView {
    constructor(cell, rowData) {
        this.cell = cell;
        this.rowData = rowData;
    }

    showValue() {
        if (this.isEditable()) {
            this.cell.firstElementChild.value = this.rowData[this.cell.firstElementChild.name]
        } else {
            this.cell.textContent = this.rowData[this.cell.dataset['name']];
        }
    }

    isEditable() {
        return !!this.cell.firstElementChild;
    }
}