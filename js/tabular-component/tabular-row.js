/**
 * Role: represent visually a row
 */
class TabularRow {
    constructor(tabularEditorState, table, rowTmpl) {
        this.context = tabularEditorState;
        this.table = table;
        this.rowTmpl = rowTmpl;
    }

    switchTo(toRowView) {
        toRowView.show();
    }

    hide() {
        this.table.deleteRow(this.context.selectedIndex);
    }

    show(create) {
        this.table.renderRow(this.context.selectedIndex, this.state, this.rowTmpl, !create);
    }

    /**
     * private
     */
    get state() {
        return this.context.items[this.context.selectedIndex];
    }
}