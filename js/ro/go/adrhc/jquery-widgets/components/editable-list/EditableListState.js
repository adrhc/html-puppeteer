class EditableListState extends SelectableListState {
    hasTransient() {
        return !!this.findById(IdentifiableEntity.TRANSIENT_ID);
    }

    /**
     * @param {SimpleError} simpleError
     * @param {number|string} rowDataId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @return {EntityRow}
     */
    createErrorItem(simpleError, rowDataId) {
        const errorRow = this._errorRowOf(simpleError, rowDataId);
        ArrayUtils.insert(errorRow.entity, errorRow.index, this.items);
        return errorRow;
    }

    /**
     * @param {SimpleError} simpleError
     * @param {number|string} rowDataId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @return {EntityRow}
     * @protected
     */
    _errorRowOf(simpleError, rowDataId) {
        const errorData = this._errorDataOf(simpleError, rowDataId);
        let index = this.indexOf({beforeRowId: errorData.failedId});
        return new EntityRow(errorData, {index});
    }

    /**
     * @param {SimpleError} simpleError
     * @param {number|string} rowDataId is the id before getting an error (e.g. IdentifiableEntity.TRANSIENT_ID)
     * @protected
     */
    _errorDataOf(simpleError, rowDataId) {
        const entity = simpleError.data;
        let failedId = entity.id != null ? entity.id : rowDataId;
        return $.extend({
            // id is used to identify the row to update and for setting the "data-id" attribute
            id: `error-row-${failedId}`,
            // failedId is used for setting "data-secondary-row-part" attribute
            failedId,
            entity,
        }, simpleError);
    }
}