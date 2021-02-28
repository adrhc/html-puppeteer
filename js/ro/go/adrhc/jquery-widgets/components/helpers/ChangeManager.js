class ChangeManager {
    changes = new Dequeue();

    /**
     * @param stateChange {StateChange}
     */
    collect(stateChange) {
        this.changes.addBack(stateChange);
    }

    /**
     * @param changeManager {ChangeManager}
     * @param fromNewest {boolean|undefined}
     */
    collectByConsumingChanges(changeManager, fromNewest = false) {
        changeManager.consumeAll(fromNewest).forEach(stateChange => this.collect(stateChange));
    }

    /**
     * Discards one previously recorded state change, the newest or earliest one, depending on @param fromNewest.
     *
     * @param fromNewest {boolean} is the consumption starting point
     * @return {StateChange}
     */
    consumeOne(fromNewest = false) {
        return fromNewest ? this.changes.removeBack() : this.changes.removeFront();
    }

    /**
     * Discards all previously recorded state changes, starting with the newest or earliest one, depending on @param fromNewest.
     *
     * @param fromNewest {boolean|undefined} is the consumption starting point
     * @return {StateChange[]}
     */
    consumeAll(fromNewest = false) {
        const changes = [];
        while (!this.changes.isEmpty()) {
            changes.push(this.consumeOne(fromNewest));
        }
        return changes;
    }

    /**
     * @param {boolean} [fromNewestToOldest]
     * @return {StateChange[]}
     */
    peekAll(fromNewestToOldest) {
        return this.changes.peekAll(fromNewestToOldest);
    }

    /**
     * @param {function(stateChange: StateChange): boolean} predicate
     * @return {undefined|*}
     */
    findFirstFromNewest(predicate) {
        return this.changes.findFirstFromBack(predicate);
    }

    reset() {
        this.changes.clear();
    }
}