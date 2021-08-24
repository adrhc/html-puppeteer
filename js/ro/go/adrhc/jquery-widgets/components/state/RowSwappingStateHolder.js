/**
 * @extends {TaggingStateHolder<EntityRowSwap, *>}
 */
class RowSwappingStateHolder extends TaggingStateHolder {
    /**
     * @param {EntityRowSwap} otherEntityRowSwap
     * @return {boolean}
     * @protected
     */
    _currentStateEquals(otherEntityRowSwap) {
        if (this.currentState != null && this.currentState.isSameContextAndEntity(otherEntityRowSwap)) {
            return true;
        }
        return super._currentStateEquals(otherEntityRowSwap);
    }

    /**
     * @param {EntityRowSwap} otherEntityRowSwap
     * @param {string|number} [partName] specify the state's part/section to change/manipulate
     * @param {boolean} [dontRecordStateEvents]
     * @return {TaggedStateChange<EntityRowSwap>|boolean} the newly created TaggedStateChange or, if dontRecordStateEvents = true, whether a state change occurred
     */
    switchTo(otherEntityRowSwap, {partName, dontRecordStateEvents} = {}) {
        return this.replace(otherEntityRowSwap, {partName, dontRecordStateEvents});
    }

    /**
     * @param {string|number} [partName] specify the state's part/section to change/manipulate
     * @param {boolean} [dontRecordStateEvents]
     * @return {TaggedStateChange<EntityRowSwap>|boolean} the newly created TaggedStateChange or, if dontRecordStateEvents = true, whether a state change occurred
     */
    switchOff({partName, dontRecordStateEvents} = {}) {
        return this.replace(undefined, {partName, dontRecordStateEvents});
    }
}