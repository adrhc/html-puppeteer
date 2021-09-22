import TypeStateChangeEnhancer from "./change/enhancer/TypeStateChangeEnhancer.js";

/**
 * @template SCT
 */
export default class StateChangesCollector {
    /**
     * @type {StateChangeEnhancer<SCT>}
     */
    stateChangeEnhancer;
    /**
     * @type {StateChange<SCT>[]}
     */
    stateChanges = [];

    /**
     * @param {StateChangeEnhancer<SCT>=} stateChangeEnhancer
     * @constructor
     */
    constructor(stateChangeEnhancer) {
        this.stateChangeEnhancer = stateChangeEnhancer ?? new TypeStateChangeEnhancer();
    }

    /**
     * @param {StateChange<SCT>|undefined} stateChange
     */
    collect(stateChange) {
        const enhancedStateChange = this.enhance(stateChange);
        if (!enhancedStateChange) {
            return undefined;
        }
        this.stateChanges.push(enhancedStateChange);
        return enhancedStateChange;
    }

    /**
     * @param {StateChange<SCT>|undefined} stateChange
     * @return {StateChange<SCT>|undefined}
     */
    enhance(stateChange) {
        return this.stateChangeEnhancer.enhance(stateChange);
    }

    /**
     * @return {StateChange<SCT>}
     */
    consumeOne() {
        return this.stateChanges.shift();
    }

    /**
     * @return {StateChange<SCT>[]}
     */
    consumeAll() {
        const changes = this.stateChanges;
        this.stateChanges = [];
        return changes;
    }

    /**
     * @param {StateChangesCollector} stateChangesCollector
     */
    collectByConsumingChanges(stateChangesCollector) {
        stateChangesCollector.consumeAll().forEach(stateChange => this.collect(stateChange));
    }
}