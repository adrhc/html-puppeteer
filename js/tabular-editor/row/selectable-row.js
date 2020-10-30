class SelectableRow {
    constructor(index, values, table, templateId) {
        this.index = index;
        this.values = values;
        this.table = table;
        this.templateId = templateId;
    }

    hide() {
        this.table.deleteRow(this.index);
    }

    nameOf(cell) {
        return cell.dataset['name'];
    }

    get htmlTableRowElement() {
        return this.table.getRowAt(this.index);
    }

    get tmplContent() {
        return document.getElementById(this.templateId).content;
    }
}