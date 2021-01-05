class IdentifiableRowComponent extends SimpleRowComponent {
    /**
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(state, view) {
        super(state, view);
    }

    updateViewOnDELETE(stateChange) {
        this.removeSecondaryRowParts();
        return super.updateViewOnDELETE(stateChange);
    }

    removeSecondaryRowParts() {
        const itemId = this.simpleRowState.rowState.id;
        console.log(`removing rows with owner = ${this.simpleRowView.owner} and secondary-row-part = ${itemId}`);
        this.simpleRowView.$getOwnedRowByData("secondary-row-part", itemId).remove();
    }
}