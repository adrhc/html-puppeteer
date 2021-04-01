/**
 * @template T
 */
class StateChangesCollector {
    /**
     * @type {Dequeue<StateChange<T>>}
     */
    changes = new Dequeue();
    /**
     * @type {IdentityStateChangeMapper<T>}
     */
    stateChangeMapper;

    /**
     * @param {IdentityStateChangeMapper<T>} stateChangeMapper
     */
    constructor(stateChangeMapper = new IdentityStateChangeMapper()) {
        this.stateChangeMapper = stateChangeMapper;
    }

    /**
     * @param {StateChange<T>|undefined} stateChange
     */
    collect(stateChange) {
        stateChange = this._transform(stateChange);
        if (!stateChange) {
            return undefined;
        }
        this.changes.addBack(stateChange);
        return stateChange;
    }

    /**
     * @param {StateChangesCollector<T>} changeManager
     * @param {boolean} [fromNewest]
     */
    collectByConsumingChanges(changeManager, fromNewest) {
        changeManager.consumeAll(fromNewest).forEach(stateChange => this.collect(stateChange));
    }

    /**
     * Discards one previously recorded state change, the newest or earliest one, depending on @param fromNewest.
     *
     * @param {boolean} [fromNewest] is the consumption starting point
     * @return {StateChange<T>}
     */
    consumeOne(fromNewest) {
        return fromNewest ? this.changes.removeBack() : this.changes.removeFront();
    }

    /**
     * Discards all previously recorded state changes, starting with the newest or earliest one, depending on @param fromNewest.
     *
     * @param {boolean} [fromNewest] is the consumption starting point
     * @return {StateChange<T>[]}
     */
    consumeAll(fromNewest) {
        const changes = [];
        while (!this.changes.isEmpty()) {
            changes.push(this.consumeOne(fromNewest));
        }
        return changes;
    }

    /**
     * @param {boolean} [fromNewestToOldest]
     * @return {StateChange<T>[]}
     */
    peekAll(fromNewestToOldest) {
        return this.changes.peekAll(fromNewestToOldest);
    }

    /**
     * @param {function(stateChange: StateChange<T>): boolean} predicate
     * @return {StateChange<T>|undefined}
     */
    findFirstFromNewest(predicate) {
        return this.changes.findFirstFromBack(predicate);
    }

    reset() {
        this.changes.clear();
    }

    /**
     * @param {StateChange<T>} stateChange
     * @return {StateChange<T>}
     * @protected
     */
    _transform(stateChange) {
        return this.stateChangeMapper.map(stateChange);
    }
}