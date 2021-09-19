import StateChangeEnhancer from "./StateChangeEnhancer.js";
import TypedStateChange, {CREATED, DELETED, RELOCATED, REPLACED} from "../TypedStateChange.js";
import {isFalse} from "../../../../util/AssertionUtils.js";
/**
 * @typedef {string,number|boolean} PartName
 */
/**
 * @template SCT, SCP
 * @typedef {SCT|SCP} STATE_OR_PART
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
        isFalse(change.previousStateOrPart == null && change.newStateOrPart == null);
        if (this._isChangeTypeOfDelete(change.newStateOrPart, change.newPartName)) {
            return DELETED;
        } else if (this._isPristine(change.previousStateOrPart, change.previousPartName)) {
            return CREATED;
        } else if (change.previousPartName != null &&
            change.newPartName != null &&
            change.previousPartName !== change.newPartName) {
            return RELOCATED;
        } else {
            return REPLACED;
        }
    }

    /**
     * @param {STATE_OR_PART=} stateOrPart
     * @param {PartName} partName
     * @return {boolean}
     * @protected
     */
    _isChangeTypeOfDelete(stateOrPart, partName) {
        return this._isPristine(stateOrPart, partName);
    }

    /**
     * @param {STATE_OR_PART=} stateOrPart
     * @param {PartName=} partName
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
     * @param {SCP=} part
     * @param {PartName} partName specify the state's part/section to change/manipulate
     * @return {boolean}
     * @protected
     */
    _isStatePartPristine(part, partName) {
        return part == null;
    }

    /**
     * @param {SCT=} state
     * @return {boolean}
     * @protected
     */
    _isStatePristine(state) {
        return state == null;
    }
}