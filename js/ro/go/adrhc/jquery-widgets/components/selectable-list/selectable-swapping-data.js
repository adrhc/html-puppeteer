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
    equals(selectableSwappingData) {
        return selectableSwappingData
            && this.context == selectableSwappingData.context
            && (this.item == selectableSwappingData.item
                || EntityUtils.prototype.idsAreEqual(this.itemId, selectableSwappingData.itemId));
    }

    /**
     * @returns {number|string|undefined} could be undefined when "previously" switched to undefined (to switch off the "previous")
     */
    get itemId() {
        return this.item ? this.item.id : undefined;
    }
}