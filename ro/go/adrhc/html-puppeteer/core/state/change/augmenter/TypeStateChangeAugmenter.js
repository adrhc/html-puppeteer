import StateChangeAugmenter from "./StateChangeAugmenter.js";
import {CREATED, RELOCATED, REMOVED, REPLACED} from "../StateChangeTypes.js";
import {isTrue} from "../../../../util/AssertionUtils.js";
/**
 * @typedef {string|number|boolean} PartName
 */
/**
 * @typedef {PartName|undefined|null} OptionalPartName
 */
/**
 * @template SCT, SCP
 * @extends {StateChangeAugmenter<SCT>}
 */
export default class TypeStateChangeAugmenter extends StateChangeAugmenter {
    /**
     * @param {PartStateChange<SCT, SCP>} stateChange
     * @return {PartStateChange<SCT, SCP>}
     */
    augment(stateChange) {
        if (stateChange) {
            stateChange.changeType = stateChange.changeType ?? this._changeTypeOf(stateChange);
        }
        return stateChange;
    }

    /**
     * @param {PartStateChange<SCT, SCP>} change
     * @return {string}
     * @protected
     */
    _changeTypeOf(change) {
        isTrue((change.previousState ?? change.newState) != null);
        if (change.previousPartName ?? change.newPartName != null) {
            return this._partChangeTypeOf(change);
        } else {
            return this._totalChangeTypeOf(/** @type {StateChange} */ change);
        }
    }

    /**
     * @param {StateChange} change
     * @return {string}
     * @protected
     */
    _totalChangeTypeOf(change) {
        if (this._isStatePristine(change.newState)) {
            return REMOVED;
        } else if (this._isStatePristine(change.previousState)) {
            return CREATED;
        } else {
            return REPLACED;
        }
    }

    /**
     * @param {PartStateChange<SCT, SCP>} change
     * @return {string}
     * @protected
     */
    _partChangeTypeOf(change) {
        isTrue((change.previousPart ?? change.newPart) != null);
        if (this._isPartPristine(change.newPart, change.newPartName)) {
            return REMOVED;
        } else if (this._isPartPristine(change.previousPart, change.previousPartName)) {
            return CREATED;
        } else if (change.previousPartName !== change.newPartName) {
            return RELOCATED;
        } else {
            return REPLACED;
        }
    }

    /**
     * @param {SCP=} part
     * @param {PartName} partName specify the state's part/section to change/manipulate
     * @return {boolean}
     * @protected
     */
    _isPartPristine(part, partName) {
        return this._isStatePristine(part);
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