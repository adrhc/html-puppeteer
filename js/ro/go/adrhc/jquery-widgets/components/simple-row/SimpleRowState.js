/**
 * @typedef {EntityRow} T
 * @extends {TaggingStateHolder<EntityRow>}
 */
class SimpleRowState extends TaggingStateHolder {
    /**
     * @param {T=} previousEntityRow
     * @param {T=} newEntityRow
     * @return {StateChange<T>[]}
     * @protected
     */
    _stateChangesOf(previousEntityRow, newEntityRow) {
        // DELETE only
        if (newEntityRow == null) {
            return [new StateChange(previousEntityRow)];
        }
        // otherwise
        const previousRowId = previousEntityRow?.entity?.id;
        const positionChanged = newEntityRow.index !== previousEntityRow?.index;
        const changes = [];
        // DELETE: previous row exists and position changed
        if (previousRowId != null && positionChanged) {
            // removing the previous row because it has to be redrawn
            // anyway considering that at least its position changed
            changes.push(new StateChange(previousEntityRow));
        }
        // CREATE: previous row is missing or the position changed
        if (previousRowId == null || positionChanged) {
            AssertionUtils.isTrue(PositionUtils.areAllButIndexValid(newEntityRow),
                `The relative positioning values must be provided!\n${JSON.stringify(newEntityRow)}`);
            changes.push(new StateChange(undefined, newEntityRow));
        }
        // REPLACE: previous row exists and the position is the same
        if (previousRowId != null && !positionChanged) {
            changes.push(new StateChange(previousEntityRow, newEntityRow));
        }
        return changes;
    }
}