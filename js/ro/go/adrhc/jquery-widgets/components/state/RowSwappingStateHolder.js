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
     * @return {TaggedStateChange<EntityRowSwap>|undefined}
     */
    switchTo(otherEntityRowSwap) {
        return this.replace(otherEntityRowSwap);
    }

    /**
     * @return {TaggedStateChange<EntityRowSwap>|undefined}
     */
    switchOff() {
        return this.replace();
    }
}