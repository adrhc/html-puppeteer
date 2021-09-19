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
     * @param {SCT=} newPart
     * @param {PartName|undefined=} previousPartName
     * @param {PartName|undefined=} newPartName
     * @param {boolean=} dontRecordStateEvents
     * @return {boolean|TypedStateChange<SCT, SCP>}
     */
    replacePart(newPart, previousPartName,
                newPartName = newPart != null ? previousPartName : undefined,
                dontRecordStateEvents) {
        isTrue(newPart != null || previousPartName != null);
        if (this._partsEqual(newPart, newPartName, previousPartName)) {
            return false;
        }

        // currentState will be changed by _replacePart
        const previousState = dontRecordStateEvents ? undefined : _.cloneDeep(this.currentState);

        const previousPart = this._replacePart(newPart, newPartName, previousPartName);

        if (dontRecordStateEvents) {
            return true;
        }

        // cloning because a subsequent partial change might alter the _currentState
        const newState = _.cloneDeep(this.currentState);

        // parts never change partially so there's no need to clone them
        const stateChange = this._partialStateChangesOf(previousPart, newPart, previousPartName, newPartName, previousState, newState);
        return this.collectStateChanges(stateChange);
    }

    /**
     * @param {SCP} previousPart
     * @param {SCP} newPart
     * @param {PartName|undefined=} previousPartName
     * @param {PartName|undefined=} newPartName
     * @param {SCT=} previousState
     * @param {SCT=} newState
     * @return {StateChange<SCT, SCT>[]}
     * @protected
     */
    _partialStateChangesOf(previousPart, newPart, previousPartName, newPartName, previousState, newState) {
        return [new PartStateChange(previousPart, newPart, previousPartName, newPartName, previousState, newState)];
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
     * @param {SCP} newPart
     * @param {PartName|undefined} newPartName
     * @param {PartName|undefined} previousPartName
     * @return {SCP} the previous part
     * @protected
     */
    _replacePart(newPart, newPartName, previousPartName) {
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
            // old item exists but the new one is null (i.e. old is deleted)
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