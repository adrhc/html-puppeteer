class EditableTableView {
    constructor(readOnlyRow, editableRow, buttonsRow, htmlTableAdapter) {
        this.readOnlyRow = readOnlyRow;
        this.editableRow = editableRow;
        this.buttonsRow = buttonsRow;
        this.htmlTableAdapter = htmlTableAdapter;
    }

    init(data) {
        this.htmlTableAdapter.renderBody(data);
    }

    /**
     * private method
     *
     * changes come in pairs: a row (previous) is hidden while another (new one) is shown (as editable)
     */
    updateView(stateChangeResult) {
        if (!stateChangeResult) {
            // selection not changed, do nothing
            return;
        }

        // dropping previous view (aka STATE_DELETED event type)
        if (stateChangeResult.prevIsRemoved) {
            // previous selection is removed: remove the related row
            this.buttonsRow.hide();
            this.readOnlyRow.hide(stateChangeResult.prevRowState);
        } else if (stateChangeResult.prevRowState) {
            // previous selection exists: change it to read-only
            this.buttonsRow.hide();
            this.readOnlyRow.show(stateChangeResult.prevRowState);
        }

        // "activating" the new view (aka STATE_CREATED event type)
        if (!stateChangeResult.newRowState) {
            // no row to display (aka there's no new view)
        } else if (stateChangeResult.newRowState.selected) {
            // change row's view to editable
            this.editableRow.show(stateChangeResult.newRowState, stateChangeResult.newIsCreated);
            this.buttonsRow.show(stateChangeResult.newRowState)
        } else {
            // change row's view to read-only
            this.readOnlyRow.show(stateChangeResult.newRowState, stateChangeResult.newIsCreated);
        }
    }

}