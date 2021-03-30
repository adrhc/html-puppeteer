class IdentifiableRowComponent extends SimpleRowComponent {
    /**
     * @param {SimpleRowView} view
     * @param {TaggingStateHolder=} state
     * @param {ComponentConfiguration=} config
     * @param {AbstractComponent=} errorComponent
     */
    constructor({view, state, config, errorComponent}) {
        super({view, state, config, errorComponent});
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