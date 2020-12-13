class BasicComponentState {
    stateChanges = new StateChanges();

    /**
     * @param stateChange {StateChange}
     */
    collectStateChange(stateChange) {
        this.stateChanges.collect(stateChange);
    }

    /**
     * @param fromLatest {boolean}
     * @return {StateChange}
     */
    consumeStateChange(fromLatest = false) {
        return this.stateChanges.consume(fromLatest);
    }

    /**
     * @param fromLatest {boolean}
     * @return {StateChange[]}
     */
    consumeAllStateChanges(fromLatest= false) {
        return this.stateChanges.consumeAll(fromLatest);
    }
}