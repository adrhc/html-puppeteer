class EditableListState extends SelectableListState {
    static ERROR_ID_PREFIX = "error-row-";

    /**
     * @param {EditableListOptions} editableListOptions
     * @return {EditableListState}
     */
    static of(editableListOptions) {
        return new EditableListState({
            newEntityFactoryFn: editableListOptions.newEntityFactoryFn,
            newItemsGoLast: editableListOptions.rowPositionOnCreate === "append"
        })
    }

    hasTransient() {
        return !!this.findById(IdentifiableEntity.TRANSIENT_ID);
    }

    /**
     * @param {string|number} id
     * @return {boolean}
     */
    isErrorItemId(id) {
        return typeof id === "string" && id.startsWith(EditableListState.ERROR_ID_PREFIX);
    }

    /**
     * @param {SimpleError} simpleError
     * @param {number|string} rowDataId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @return {TaggedStateChange<EntityRow<IdentifiableEntity>>}
     */
    createErrorItem(simpleError, rowDataId) {
        const errorData = this._errorDataOf(simpleError, rowDataId);
        return this.createOrUpdate(errorData, {beforeRowId: errorData.failedId});
    }

    /**
     * @param {SimpleError} simpleError
     * @param {number|string} rowDataId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @return {{id, failedId, entity}} contains simpleError fields too
     * @protected
     */
    _errorDataOf(simpleError, rowDataId) {
        const entity = simpleError.data;
        let failedId = entity.id != null ? entity.id : rowDataId;
        // id is used to identify the row to update and for setting the "data-id" attribute
        // failedId is used for setting "data-secondary-row-part" attribute
        return {id: `${EditableListState.ERROR_ID_PREFIX}${failedId}`, failedId, entity, ...simpleError};
    }
}