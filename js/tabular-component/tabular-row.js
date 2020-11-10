/**
 * Role: represent the rendering capabilities of TabularComponent at row level
 */
class TabularRow {
    constructor(tabularEditorState, table, rowTmpl) {
        this.context = tabularEditorState;
        this.table = table;
        this.rowTmpl = rowTmpl;
    }

    hide() {
        this.table.deleteRow(this.context.selectedIndex);
    }

    show(asNew) {
        this.table.renderRow(this.context.selectedIndex, this.state, this.rowTmpl, !asNew);
    }

    /**
     * private
     */
    get state() {
        return this.context.items[this.context.selectedIndex];
    }
}