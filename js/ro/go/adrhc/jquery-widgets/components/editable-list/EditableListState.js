/**
 * SelectableListState extends CrudListState extends SimpleListState extends TaggingStateHolder extends StateHolder
 *
 * @template E
 * @extends {SelectableListState<E>}
 */
class EditableListState extends SelectableListState {
    hasTransient() {
        return !!this.findById(IdentifiableEntity.TRANSIENT_ID);
    }

    /**
     * @param {SimpleError} simpleError
     * @param {number|string} failedItemId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>>}
     */
    createErrorItem(simpleError, failedItemId) {
        const errorEntity = FailedEntity.of(simpleError, failedItemId);
        return this.createOrUpdate(errorEntity, undefined, {beforeRowId: errorEntity.failedItemId});
    }

    /**
     * @param {FailedEntity=} errorEntity
     */
    removeErrorItems(...errorEntity) {
        const items = errorEntity.length ? errorEntity : this.items;
        items
            .map(entityRow => entityRow.entity)
            .filter(entity => FailedEntity.isErrorItemId(entity.id))
            .forEach(errorEntity => this.removeById(errorEntity.id));
    }
}