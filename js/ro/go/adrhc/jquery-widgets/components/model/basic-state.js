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

    collectStateChangesArray(stateChanges) {
        stateChanges.forEach(stateChange => this.collectStateChange(stateChange));
    }

    /**
     * @param fromLatest {boolean|undefined}
     * @return {StateChange}
     */
    consumeStateChange(fromLatest = false) {
        return this._stateChanges.consume(fromLatest);
    }

    /**
     * @param fromLatest {boolean|undefined}
     * @return {StateChange[]}
     */
    consumeAllStateChanges(fromLatest = false) {
        return this._stateChanges.consumeAll(fromLatest);
    }

    get stateChanges() {
        return this._stateChanges;
    }

    reset() {
        this._stateChanges = new StateChanges();
    }
}