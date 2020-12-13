class BasicComponentState {
    /**
     * @type {StateChanges}
     * @private
     */
    _stateChanges = new StateChanges();

    /**
     * @param stateChange {StateChange}
     */
    collectStateChange(stateChange) {
        this._stateChanges.collect(stateChange);
    }

    /**
     * @param fromLatest {boolean}
     * @return {StateChange}
     */
    consumeStateChange(fromLatest = false) {
        return this._stateChanges.consume(fromLatest);
    }

    /**
     * @param fromLatest {boolean}
     * @return {StateChange[]}
     */
    consumeAllStateChanges(fromLatest= false) {
        return this._stateChanges.consumeAll(fromLatest);
    }
}