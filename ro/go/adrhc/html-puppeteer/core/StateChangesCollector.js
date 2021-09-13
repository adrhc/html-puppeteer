import StateChangeEnhancer from "./StateChangeEnhancer";

export default class StateChangesCollector {
    /**
     * @type {StateChangeEnhancer}
     */
    stateChangeEnhancer;
    /**
     * @type {StateChange[]}
     */
    stateChanges = [];

    /**
     * @param {StateChangeEnhancer} stateChangeEnhancer
     */
    constructor(stateChangeEnhancer = new StateChangeEnhancer()) {
        this.stateChangeEnhancer = stateChangeEnhancer;
    }

    /**
     * @param {StateChange|undefined} stateChange
     */
    collect(stateChange) {
        stateChange = this.stateChangeEnhancer.enhance(stateChange);
        if (!stateChange) {
            return undefined;
        }
        this.stateChanges.push(stateChange);
        return stateChange;
    }

    /**
     * @return {StateChange}
     */
    consumeOne() {
        return this.stateChanges.shift();
    }

    /**
     * @return {StateChange[]}
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