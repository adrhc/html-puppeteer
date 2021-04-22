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
     * @return {TaggedStateChange<EntityRowSwap>|undefined}
     */
    switchTo(otherEntityRowSwap, {partName, dontRecordStateEvents} = {}) {
        return this.replace(otherEntityRowSwap);
    }

    /**
     * @param {string|number} [partName] specify the state's part/section to change/manipulate
     * @param {boolean} [dontRecordStateEvents]
     * @return {TaggedStateChange<EntityRowSwap>|undefined}
     */
    switchOff({partName, dontRecordStateEvents} = {}) {
        return this.replace();
    }
}