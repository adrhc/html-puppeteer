class PropertyView {
    constructor(cell, rowData) {
        this.cell = cell;
        this.rowData = rowData;
    }

    showValue() {
        if (this.isEdited()) {
            this.cell.firstElementChild.value = this.rowData[this.cell.firstElementChild.name]
        } else {
            this.cell.textContent = this.rowData[this.cell.dataset['name']];
        }
    }

    isEdited() {
        return !!this.cell.firstElementChild;
    }
}