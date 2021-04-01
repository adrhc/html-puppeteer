class EntityRowSwap extends EntityRow {
    /**
     * @type {*}
     */
    context
    /**
     * @type {number|string} is the id used to reload the item (see SelectableListState.reloadItemOnSwapping)
     */
    reloadedId;

    /**
     * @param {IdentifiableEntity} [entity]
     * @param {*=} context
     * @param {number=} index
     * @param {number|string=} beforeRowId
     * @param {number|string=} afterRowId
     * @param {number|string=} reloadedId
     */
    constructor(entity, {context, index, beforeRowId, afterRowId, reloadedId}) {
        super(entity, {index, beforeRowId, afterRowId});
        this.reloadedId = reloadedId;
        this.context = context;
    }

    /**
     * must use "==" to compare undefined to null
     *
     * @return {boolean}
     */
    isSameContextAndEntity(selectableSwappingData) {
        return (
                this.context == null && selectableSwappingData?.context == null
                || this.context === selectableSwappingData?.context
            )
            &&
            EntityUtils.idsAreEqual(this.entityId, selectableSwappingData?.entityId);
    }

    /**
     * @returns {number|string|undefined} could be undefined when "previously" switched to undefined (to switch off the "previous")
     */
    get entityId() {
        return this.entity?.id;
    }
}