/**
 *
 */
class EditableListState extends SelectableListState {
    /**
     * @param {EditableListOptions} editableListOptions
     * @return {EditableListState}
     */
    static of(editableListOptions) {
        return new EditableListState({
            newEntityFactoryFn: editableListOptions.newEntityFactoryFn,
            newItemsGoLast: editableListOptions.rowPositionOnCreate != null ?
                editableListOptions.rowPositionOnCreate === "append" : undefined
        })
    }

    hasTransient() {
        return !!this.findById(IdentifiableEntity.TRANSIENT_ID);
    }

    /**
     * @param {SimpleError} simpleError
     * @param {number|string} failedId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>>}
     */
    createErrorItem(simpleError, failedId) {
        const errorEntity = ErrorEntity.of(simpleError, failedId);
        return this.createOrUpdate(errorEntity, {beforeRowId: errorEntity.failedId});
    }

    /**
     * @param {ErrorEntity=} errorEntity
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>> | boolean} false if the entity is missing or the implied state change
     */
    removeErrorItem(errorEntity) {
        let id = errorEntity?.id ?? this.items.find(it => ErrorEntity.isErrorItemId(it.id))?.id;
        if (id == null || !ErrorEntity.isErrorItemId(id)) {
            return false;
        }
        return this.removeById(id);
    }
}