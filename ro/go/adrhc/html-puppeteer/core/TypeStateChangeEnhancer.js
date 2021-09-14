import StateChangeEnhancer from "./StateChangeEnhancer.js";
import TypedStateChange, {CUDTypes} from "./TypedStateChange.js";
import AssertionUtils from "../util/AssertionUtils.js";

/**
 * @template SCT, SCP
 * @extends {StateChangeEnhancer<SCT, SCP>}
 */
export default class TypeStateChangeEnhancer extends StateChangeEnhancer {
    /**
     * @param {StateChange<SCT, SCP>} stateChange
     * @return {TypedStateChange<SCT, SCP>}
     */
    enhance(stateChange) {
        if (!stateChange) {
            return undefined;
        } else if (stateChange instanceof TypedStateChange) {
            return stateChange;
        }
        return _.defaults(new TypedStateChange(this._changeTypeOf(stateChange)), stateChange);
    }

    /**
     * @param {StateChange<SCT, SCP>} change
     * @return {string}
     * @protected
     */
    _changeTypeOf(change) {
        AssertionUtils.isFalse(change.previousStateOrPart == null && change.newStateOrPart == null);
        if (this._isChangeTypeOfDelete(change.newStateOrPart, change.newPartName)) {
            return CUDTypes.DELETED;
        } else if (this._isPristine(change.previousStateOrPart, change.previousPartName)) {
            return CUDTypes.CREATED;
        } else if (change.previousPartName != null &&
            change.newPartName != null &&
            change.previousPartName !== change.newPartName) {
            return CUDTypes.RELOCATED;
        } else {
            return CUDTypes.REPLACED;
        }
    }

    /**
     * @param {undefined|T} stateOrPart
     * @param {string} partName
     * @return {boolean}
     * @protected
     */
    _isChangeTypeOfDelete(stateOrPart, partName) {
        return this._isPristine(stateOrPart, partName);
    }

    /**
     * @param {undefined|T} stateOrPart
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
        return part == null;
    }

    /**
     * @param {undefined|T} state
     * @return {boolean}
     * @protected
     */
    _isStatePristine(state) {
        return state == null;
    }
}