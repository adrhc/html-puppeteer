class IdentifiableRowComponent extends SimpleRowComponent {
    /**
     * @param state {BasicState}
     * @param view {SimpleRowView}
     */
    constructor(state, view) {
        super(state, view);
    }

    updateViewOnDELETE(stateChange) {
        this.removeSecondaryRowParts(stateChange.previousStateOrPart.values.id);
        return super.updateViewOnDELETE(stateChange);
    }

    removeSecondaryRowParts(rowId) {
        console.log(`removing rows with owner = ${this.simpleRowView.owner} and secondary-row-part = ${rowId}`);
        this.simpleRowView.$getOwnedRowByData("secondary-row-part", rowId).remove();
    }
}