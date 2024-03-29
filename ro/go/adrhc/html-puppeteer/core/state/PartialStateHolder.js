import StateHolder, {stateIsEmpty} from "./StateHolder.js";
import {isTrue} from "../../util/AssertionUtils.js";
import {removeByIndex, updateOrInsert} from "../../util/ArrayUtils.js";
import PartStateChange from "./change/PartStateChange.js";

/**
 * @template SCT, SCP
 */
export default class PartialStateHolder extends StateHolder {
    /**
     * @param {PartName} partName
     * @param {boolean=} dontClone
     * @return {SCP}
     */
    getPart(partName, dontClone) {
        const part = _.get(this._currentState, partName);
        return dontClone || part == null ? part : _.cloneDeep(part);
    }

    /**
     * @param  {PartName} partName
     * @return {boolean}
     */
    hasEmptyPart(partName) {
        return stateIsEmpty(_.get(this._currentState, partName));
    }

    /**
     * @return {{[key: string]: *}[]}
     */
    getParts() {
        return partsOf(this.stateCopy);
    }

    /**
     * @param {(PartName|undefined)=} previousPartName
     * @param {SCT=} newPart
     * @param {(PartName|undefined)=} newPartName
     * @param {boolean=} dontRecordChanges
     * @return {PartStateChange<SCT, SCP>[]}
     */
    replacePart(previousPartName, newPart,
                newPartName = newPart != null ? previousPartName : undefined,
                dontRecordChanges) {
        isTrue(this._currentState != null || newPart == null,
            "[PartialStateHolder.replacePart] can't add partial state to missing parent state!")
        if (this._partsEqual(newPart, newPartName, previousPartName)) {
            return [];
        }

        // currentState will be changed by _replacePart
        const previousState = this.stateCopy;

        // parts never change partially so there's no need to clone them
        const previousPart = this._replacePart(previousPartName, newPart, newPartName);

        // cloning because a subsequent partial change might alter the _currentState
        // which now is newState hence the stateChanges below might be altered too
        const newState = this.stateCopy;

        const stateChanges = /** @type {StateChange[]} */ this
            ._partialStateChangesOf(previousState, newState, previousPart, newPart,
                previousPart == null ? undefined : previousPartName, newPartName);

        if (dontRecordChanges) {
            return /** @type {PartStateChange[]} */ this._augmentStateChanges(stateChanges);
        }

        return /** @type {PartStateChange[]} */ this._collectStateChanges(stateChanges);
    }

    /**
     * @param {SCP} previousPart
     * @param {SCP} newPart
     * @param {PartName|undefined=} previousPartName
     * @param {PartName|undefined=} newPartName
     * @param {SCT=} previousState
     * @param {SCT=} newState
     * @return {PartStateChange<SCT, SCP>[]}
     * @protected
     */
    _partialStateChangesOf(previousState, newState, previousPart, newPart, previousPartName, newPartName) {
        return [new PartStateChange(previousState, newState, previousPart, newPart, previousPartName, newPartName)];
    }

    /**
     * @param {SCP} newPart
     * @param {PartName} newPartName
     * @param {PartName} previousPartName
     * @return {boolean}
     * @protected
     */
    _partsEqual(newPart, newPartName, previousPartName) {
        const previousPart = this.getPart(previousPartName, true);
        return newPart == null && previousPart == null || newPart === previousPart;
    }

    /**
     * @param {(PartName|undefined)=} previousPartName
     * @param {SCP=} newPart
     * @param {(PartName|undefined)=} newPartName
     * @return {SCP} the previous part
     * @protected
     */
    _replacePart(previousPartName, newPart, newPartName) {
        const previousPart = this.getPart(previousPartName, true);
        if (previousPart == null) {
            if (newPart == null) {
                console.warn("both old and new items are null, nothing else to do");
                return previousPart;
            }
            isTrue(newPartName != null,
                "[PartialStateHolder._replacePart] Can't insert empty new part name!");
            // old item doesn't exists, inserting the new one
            this._insertPart(newPart, newPartName);
        } else if (newPart == null) {
            // old item exists but the new one is null (i.e. old is removed)
            isTrue(previousPartName != null,
                "[PartialStateHolder._replacePart] Can't remove empty previous part name!");
            this._removePart(previousPartName);
        } else if (previousPartName === newPartName) {
            // this is an update
            // handles inner parts too, e.g. _currentState[inner1.inner11] = newPart
            _.set(this._currentState, newPartName, newPart);
        } else {
            // this is a relocation, e.g. _currentState[3] moved to _currentState[4]
            isTrue(previousPartName != null,
                "[PartialStateHolder._replacePart] Can't remove empty previous part name!");
            isTrue(newPartName != null,
                "[PartialStateHolder._replacePart] Can't insert empty new part name!");
            // previousItem and newPart are not null
            this._removePart(previousPartName);
            this._insertPart(newPart, newPartName);
        }
        return previousPart;
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _removePart(partName) {
        if (_.isArray(this._currentState)) {
            removeByIndex(this._currentState, partName);
        } else {
            delete this._currentState[partName];
        }
    }

    /**
     * @param {SCP} part
     * @param {PartName} partName
     * @protected
     */
    _insertPart(part, partName) {
        if (_.isArray(this._currentState)) {
            updateOrInsert(this._currentState, part, partName);
        } else {
            this._currentState[partName] = part;
        }
    }

    /**
     * @param {StateChange<SCT>[]=} stateChanges
     * @return {StateChange<SCT>[]}
     * @protected
     */
    _augmentStateChanges(stateChanges = []) {
        return stateChanges.map(sc => this._stateChangesCollector.augment(sc)).filter(it => it != null);
    }
}

/**
 * @param {*} value
 * @param {boolean=} reversePartsOrder
 * @return {[string, *][]}
 */
export function partsOf(value, reversePartsOrder) {
    if (value == null) {
        return [];
    }
    return reversePartsOrder ? Object.entries(value).reverse() : Object.entries(value);
}