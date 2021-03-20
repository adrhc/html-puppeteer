class IdentifiableRowComponent extends SimpleRowComponent {
    /**
     * @param {TaggingStateHolder} state
     * @param {SimpleRowView} view
     * @param {AbstractComponent=} errorComponent
     */
    constructor(state, view, errorComponent) {
        super(state, view, errorComponent);
    }

    updateViewOnDELETE(stateChange) {
        this.removeSecondaryRowParts(stateChange.previousStateOrPart.entity.id);
        return super.updateViewOnDELETE(stateChange);
    }

    removeSecondaryRowParts(rowId) {
        console.log(`removing rows with owner = ${this.simpleRowView.owner} and secondary-row-part = ${rowId}`);
        this.simpleRowView.$getOwnedRowByData("secondary-row-part", rowId).remove();
    }
}