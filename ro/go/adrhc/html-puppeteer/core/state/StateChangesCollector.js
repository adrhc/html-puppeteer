import TypeStateChangeAugmenter from "./change/augmenter/TypeStateChangeAugmenter.js";

/**
 * @template SCT
 */
export default class StateChangesCollector {
    /**
     * @type {StateChangeAugmenter<SCT>}
     */
    stateChangeAugmenter;
    /**
     * @type {StateChange<SCT>[]}
     */
    stateChanges = [];

    /**
     * @param {StateChangeAugmenter<SCT>=} stateChangeAugmenter
     * @constructor
     */
    constructor(stateChangeAugmenter) {
        this.stateChangeAugmenter = stateChangeAugmenter ?? new TypeStateChangeAugmenter();
    }

    /**
     * @param {StateChange<SCT>|undefined} stateChange
     */
    collect(stateChange) {
        const augmentedStateChange = this.augment(stateChange);
        if (!augmentedStateChange) {
            return undefined;
        }
        this.stateChanges.push(augmentedStateChange);
        return augmentedStateChange;
    }

    /**
     * @param {StateChange<SCT>|undefined} stateChange
     * @return {StateChange<SCT>|undefined}
     */
    augment(stateChange) {
        return this.stateChangeAugmenter.augment(stateChange);
    }

    /**
     * @return {StateChange<SCT>[]}
     */
    consumeAll() {
        const changes = this.stateChanges;
        this.stateChanges = [];
        return changes;
    }
}