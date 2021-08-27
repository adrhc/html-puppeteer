/**
 *
 */
class EditableListState extends SelectableListState {
    /**
     * @param {EditableListOptions} editableListOptions
     * @return {EditableListState}
     */
    constructor(editableListOptions) {
        return new EditableListState({
            newEntityFactoryFn: editableListOptions.newEntityFactoryFn,
            newItemsGoLast: editableListOptions.newItemsGoLast
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
     */
    removeErrorItems(...errorEntity) {
        const items = errorEntity.length ? errorEntity : this.items;
        items
            .filter(it => ErrorEntity.isErrorItemId(it.id))
            .forEach(errorEntity => this.removeById(errorEntity.id));
    }
}