class IdentifiableRowComponent extends SimpleRowComponent {
    static SECONDARY_ROW_PART = "secondary-row-part";

    /**
     * @param {TaggedStateChange<EntityRow>} stateChange
     * @return {Promise<TaggedStateChange<EntityRow>>}
     */
    updateViewOnAny(stateChange) {
        this._removeSecondaryRowParts(stateChange.newStateOrPart.entity.id);
        return super.updateViewOnAny(stateChange);
    }

    /**
     * @param {TaggedStateChange<EntityRow>} stateChange
     * @return {Promise<TaggedStateChange<EntityRow>>}
     */
    updateViewOnDELETE(stateChange) {
        this._removeSecondaryRowParts(stateChange.previousStateOrPart?.entity.id);
        return super.updateViewOnDELETE(stateChange);
    }

    /**
     * @param {string|number} rowId
     * @protected
     */
    _removeSecondaryRowParts(rowId) {
        if (rowId == null) {
            return;
        }
        console.log(`removing rows with owner = ${this.simpleRowView.owner} and ${IdentifiableRowComponent.SECONDARY_ROW_PART} = ${rowId}`);
        this.simpleRowView.$getOwnedRowByData(IdentifiableRowComponent.SECONDARY_ROW_PART, rowId).remove();
    }
}