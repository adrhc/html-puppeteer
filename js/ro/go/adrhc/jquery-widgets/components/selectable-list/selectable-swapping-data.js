class SelectableSwappingData {
    /**
     * @type {number|string} is the id used to reload the item (see SelectableListState.reloadItemOnSwapping)
     */
    reloadedId;

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
                || (this.item && selectableSwappingData.item
                    && EntityUtils.prototype.idsAreEqual(this.item.id, selectableSwappingData.item.id)));
    }
}