class StateChanges {
    changes = new Dequeue();

    /**
     * @param stateChange {StateChange}
     */
    collect(stateChange) {
        this.changes.addBack(stateChange);
    }

    /**
     * @param fromNewest {boolean} is the consumption starting point
     * @return {StateChange}
     */
    consumeOne(fromNewest = false) {
        return fromNewest ? this.changes.removeBack() : this.changes.removeFront();
    }

    /**
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
}