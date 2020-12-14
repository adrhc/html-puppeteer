class StateChanges {
    changes = new Dequeue();

    /**
     * @param stateChange {StateChange}
     */
    collect(stateChange) {
        this.changes.addBack(stateChange);
    }

    /**
     * @param fromLatest {boolean} is the consumption starting point
     * @return {StateChange}
     */
    consumeOne(fromLatest = false) {
        return fromLatest ? this.changes.removeBack() : this.changes.removeFront();
    }

    /**
     * @param fromLatest {boolean|undefined} is the consumption starting point
     * @return {StateChange[]}
     */
    consumeAll(fromLatest = false) {
        const changes = [];
        while (!this.changes.isEmpty()) {
            changes.push(this.consumeOne(fromLatest));
        }
        return changes;
    }
}