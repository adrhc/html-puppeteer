/**
 * @template T, P
 * @typedef {T|P} TYPE_OR_PART
 * @extends {IdentityStateChangeMapper<TYPE_OR_PART>}
 */
class TaggingStateChangeMapper extends IdentityStateChangeMapper {
    /**
     * @param {StateChange<TYPE_OR_PART, TYPE_OR_PART>} stateChange
     * @return {TaggedStateChange<TYPE_OR_PART, TYPE_OR_PART>}
     */
    map(stateChange) {
        if (!stateChange) {
            return undefined;
        } else if (stateChange instanceof TaggedStateChange) {
            return stateChange;
        }
        return _.defaults(new TaggedStateChange(this._changeTypeOf(stateChange)), stateChange);
    }

    /**
     * @param {StateChange<TYPE_OR_PART>} change
     * @return {string}
     * @protected
     */
    _changeTypeOf(change) {
        if (this._isChangeTypeOfDelete(change.newStateOrPart, change.partName)) {
            return "DELETE";
        } else if (this._isPristine(change.previousStateOrPart, change.partName)) {
            return "CREATE";
        } else {
            return "REPLACE";
        }
    }

    /**
     * @param {undefined|TYPE_OR_PART} stateOrPart
     * @param {string} partName
     * @return {boolean}
     * @protected
     */
    _isChangeTypeOfDelete(stateOrPart, partName) {
        return this._isPristine(stateOrPart, partName);
    }

    /**
     * @param {undefined|TYPE_OR_PART} stateOrPart
     * @param {string} [partName]
     * @return {boolean}
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
     * @param {undefined|P} part
     * @param {string} partName specify the state's part/section to change/manipulate
     * @return {boolean}
     * @protected
     */
    _isStatePartPristine(part, partName) {
        return part == null || $.isArray(part) && !part.length;
    }

    /**
     * @param {undefined|T} state
     * @return {boolean}
     * @protected {boolean}
     */
    _isStatePristine(state) {
        return state == null || $.isArray(state) && !state.length;
    }
}