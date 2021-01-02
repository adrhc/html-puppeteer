class SelectableSwappingData {
    /**
     * @type {number|string} is the id used to reload the item (see SelectableListState.reloadItemOnSwapping)
     */
    reloadedId;

    /**
     * @param item {IdentifiableEntity}
     * @param context
     */
    constructor(item, context) {
        this.item = item;
        this.context = context;
    }

    /**
     * must use "==" to compare undefined to null
     *
     * @return {boolean}
     */
    similarTo(selectableSwappingData) {
        return selectableSwappingData
            && (this.context == null && selectableSwappingData.context == null
                || this.context == selectableSwappingData.context)
            && (this.itemId == null && selectableSwappingData.itemId == null
                || EntityUtils.prototype.idsAreEqual(this.itemId, selectableSwappingData.itemId));
    }

    /**
     * @returns {number|string|undefined} could be undefined when "previously" switched to undefined (to switch off the "previous")
     */
    get itemId() {
        return this.item ? this.item.id : undefined;
    }
}