import StateHolder from "./StateHolder.js";
import {isTrue} from "../../util/AssertionUtils.js";
import {insert, removeByIndex} from "../../util/ArrayUtils.js";
import PartStateChange from "./change/PartStateChange.js";

/**
 * @template SCT, SCP
 */
export default class PartialStateHolder extends StateHolder {
    /**
     * @param {PartName} partName
     * @return {SCP}
     */
    getPart(partName) {
        return this.currentState[partName];
    }

    /**
     * @return {{[key: string]: *}[]}
     */
    getParts() {
        if (this.currentState == null) {
            return [];
        }
        return Object.entries(this.currentState);
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
        isTrue(newPart != null || previousPartName != null);
        if (this._partsEqual(newPart, newPartName, previousPartName)) {
            return [];
        }

        // currentState will be changed by _replacePart
        const previousState = _.cloneDeep(this.currentState);

        const previousPart = this._replacePart(previousPartName, newPart, newPartName);

        // cloning because a subsequent partial change might alter the _currentState
        const newState = _.cloneDeep(this.currentState);

        // parts never change partially so there's no need to clone them
        const stateChanges = /** @type {StateChange[]} */ this
            ._partialStateChangesOf(previousState, newState, previousPart, newPart,
                previousPart == null ? undefined : previousPartName, newPartName);

        if (dontRecordChanges) {
            return /** @type {PartStateChange[]} */ this.enhanceStateChanges(stateChanges);
        }

        return /** @type {PartStateChange[]} */ this.collectStateChanges(stateChanges);
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
        const previousPart = this.getPart(previousPartName);
        return newPart === previousPart;
    }

    /**
     * @param {(PartName|undefined)=} previousPartName
     * @param {SCP=} newPart
     * @param {(PartName|undefined)=} newPartName
     * @return {SCP} the previous part
     * @protected
     */
    _replacePart(previousPartName, newPart, newPartName) {
        isTrue(newPart == null && newPartName == null || newPart != null && newPartName != null);
        const previousItem = this.getPart(previousPartName);
        if (previousItem == null) {
            if (newPart == null) {
                console.warn("both old and new items are null, nothing else to do");
                return previousItem;
            }
            // old item doesn't exists, inserting the new one
            this._insertPart(newPart, newPartName);
        } else if (newPart == null) {
            // old item exists but the new one is null (i.e. old is removed)
            this._removePart(previousPartName);
        } else {
            // previousItem and newPart are not null
            this._removePart(previousPartName);
            this._insertPart(newPart, newPartName);
        }
        return previousItem;
    }

    /**
     * @param {PartName} partName
     * @protected
     */
    _removePart(partName) {
        if (_.isArray(this.currentState)) {
            removeByIndex(this.currentState, partName);
        } else {
            delete this.currentState[partName];
        }
    }

    /**
     * @param {SCP} part
     * @param {PartName} partName
     * @protected
     */
    _insertPart(part, partName) {
        if (_.isArray(this.currentState)) {
            insert(this.currentState, part, partName);
        } else {
            this.currentState[partName] = part;
        }
    }
}