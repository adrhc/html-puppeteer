class EntityRowSwap {
    /**
     * @type {number|string} is the id used to reload the item (see SelectableListState.reloadItemOnSwapping)
     */
    reloadedId;
    /**
     * @type {EntityRow}
     */
    entityRow;
    /**
     * @type {string}
     */
    context

    /**
     * @param {EntityRow} entityRow
     * @param {string} context
     */
    constructor(entityRow, context) {
        this.entityRow = entityRow;
        this.context = context;
    }

    /**
     * must use "==" to compare undefined to null
     *
     * @return {boolean}
     */
    similarTo(selectableSwappingData) {
        return (
                this.context == null && selectableSwappingData?.context == null
                || this.context === selectableSwappingData?.context
            )
            &&
            EntityUtils.idsAreEqual(this.itemId, selectableSwappingData?.itemId);
    }

    /**
     * @returns {number|string|undefined} could be undefined when "previously" switched to undefined (to switch off the "previous")
     */
    get itemId() {
        return this.entityRow?.entity.id;
    }
}