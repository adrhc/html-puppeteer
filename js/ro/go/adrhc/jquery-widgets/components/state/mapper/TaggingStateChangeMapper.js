class TaggingStateChangeMapper extends IdentityStateChangeMapper {
    /**
     * @param {StateChange} stateChange
     * @return {TaggedStateChange}
     */
    map(stateChange) {
        if (!stateChange) {
            return undefined;
        } else if (stateChange instanceof TaggedStateChange) {
            return stateChange;
        }
        const typedStateChange = $.extend(new TaggedStateChange(), stateChange);
        typedStateChange.changeType = this._changeTypeOf(stateChange);
        return typedStateChange;
    }

    /**
     * @param {StateChange} change
     * @return {string}
     * @protected
     */
    _changeTypeOf(change) {
        if (this._isChangeTypeOfDelete(change.stateOrPart, change.partName)) {
            return "DELETE";
        } else if (this._isPristine(change.previousStateOrPart, change.partName)) {
            return "CREATE";
        } else {
            return "REPLACE";
        }
    }

    /**
     * @param {*} stateOrPart
     * @param {string} partName
     * @return {boolean|*}
     * @protected
     */
    _isChangeTypeOfDelete(stateOrPart, partName) {
        return this._isPristine(stateOrPart, partName);
    }

    /**
     * @param {*} stateOrPart
     * @param {string} [partName]
     * @return {boolean|*}
     * @protected
     */
    _isPristine(stateOrPart, partName) {
        if (partName) {
            return this._isStatePartPristine(stateOrPart, partName);
        } else {
            return this._isStatePristine(stateOrPart);
        }
    }

    /**
     * @param {*} part
     * @param {string} partName specify the state's part/section to change/manipulate
     * @return {boolean}
     * @protected
     */
    _isStatePartPristine(part, partName) {
        return part == null || $.isArray(part) && !part.length;
    }

    _isStatePristine(state) {
        return state == null || $.isArray(state) && !state.length;
    }
}