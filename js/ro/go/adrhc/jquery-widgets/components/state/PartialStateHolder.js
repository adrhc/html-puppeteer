/**
 * @template TItem
 * @extends {SimpleListState<TItem>}
 */
class PartialStateHolder extends SimpleListState {
    /**
     * @param {TItem=} newStateOrPart
     * @param {string|number=} previousPartName
     * @param {string|number=} newPartName is the "new" part name; could be empty when replacing with nothing (aka "delete"); by default keeping the previous part name if the new one is not provided and newStateOrPart is not empty
     * @param {boolean=} dontRecordStateEvents
     * @return {TaggedStateChange<T>|boolean}
     */
    replaceStateOrPart(newStateOrPart, previousPartName,
                       newPartName = newStateOrPart != null ? previousPartName : undefined,
                       dontRecordStateEvents) {
        AssertionUtils.isTrue(newStateOrPart != null || previousPartName != null);
        if (this._currentStateOrPartEquals(newStateOrPart, newPartName, previousPartName)) {
            return false;
        }

        const previousStateOrPart = this._replaceStateOrPartImpl(newStateOrPart, newPartName, previousPartName);

        if (dontRecordStateEvents) {
            return true;
        }

        const stateChange = new StateChange(previousStateOrPart, newStateOrPart, previousPartName, newPartName);
        return this.collectStateChange(stateChange);
    }

    _replaceStateOrPartImpl(newStateOrPart, newPartName, previousPartName) {
        if (newPartName == null && previousPartName == null) {
            // here is about a full state replacement
            return super._replaceImpl(newStateOrPart);
        }
        // replacing state parts
        return this._replacePart(newStateOrPart, newPartName, previousPartName);
    }

    /**
     * @param {P} newPart
     * @param {string|number} newPartName
     * @param {string|number} previousPartName
     * @return {P} the previous part
     * @protected
     * @abstract
     */
    _replacePart(newPart, newPartName, previousPartName) {
        throw new Error(`_replaceStateOrPartImpl is not implemented!\nnewPartName = ${newPartName}, previousPartName = ${previousPartName}\nnewPart: ${newPart}`);
    }

    /**
     * @param {TItem} newStateOrPart
     * @param {string|number} newPartName
     * @param {string|number} currentPartName is also know as "previous" part name
     * @return {boolean}
     * @protected
     */
    _currentStateOrPartEquals(newStateOrPart, newPartName, currentPartName) {
        if (newPartName == null && currentPartName == null) {
            // here is about a full state comparison
            return super._currentStateEquals(newStateOrPart);
        }
        // comparing state parts
        return this._currentPartEquals(currentPartName, newStateOrPart);
    }

    /**
     * @param {string|number} currentPartName is also know as "previous" part name
     * @param {P} newPart
     * @return {boolean}
     * @protected
     */
    _currentPartEquals(currentPartName, newPart) {
        const previousPart = this._getPartByName(currentPartName);
        return newPart === previousPart;
    }

    /**
     * @param {string|number} partName
     * @return {P} the part for partName
     * @protected
     * @abstract
     */
    _getPartByName(partName) {
        throw new Error(`_getPartByName is not implemented!\npartName = ${partName}`);
    }
}