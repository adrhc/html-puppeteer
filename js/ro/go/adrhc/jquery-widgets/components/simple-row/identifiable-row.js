class IdentifiableRowComponent extends SimpleRowComponent {
    /**
     * @type {SimpleRowView}
     */
    simpleRowView;

    /**
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(state, view) {
        super(state, view);
        this.simpleRowView = view;
    }

    updateViewOnDELETE(stateChange) {
        this.removeSecondaryRowParts();
        return super.updateViewOnDELETE(stateChange);
    }

    removeSecondaryRowParts() {
        const itemId = this.state.rowState.id;
        console.log(`removing rows with owner = ${this.owner} and secondary-row-part = ${itemId}`);
        this.tableAdapter.$getOwnedRowByData("secondary-row-part", itemId).remove();
    }
}