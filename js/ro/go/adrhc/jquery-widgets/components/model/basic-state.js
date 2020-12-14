class BasicState {
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
     * @param fromLatest {boolean|undefined}
     * @param stateChanges {StateChanges}
     */
    collectAnotherStateChanges(stateChanges, fromLatest = false) {
        stateChanges.consumeAll(fromLatest).forEach(stateChange => this.collectStateChange(stateChange));
    }

    /**
     * @param fromLatest {boolean|undefined}
     * @return {StateChange}
     */
    consumeOne(fromLatest = false) {
        return this._stateChanges.consumeOne(fromLatest);
    }

    /**
     * @param fromLatest {boolean|undefined}
     * @return {StateChange[]}
     */
    consumeAll(fromLatest = false) {
        return this._stateChanges.consumeAll(fromLatest);
    }

    get stateChanges() {
        return this._stateChanges;
    }

    reset() {
        this._stateChanges = new StateChanges();
    }
}