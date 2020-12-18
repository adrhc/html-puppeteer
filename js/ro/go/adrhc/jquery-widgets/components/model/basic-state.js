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
     * @param stateChanges {StateChanges}
     * @param fromLatest {boolean|undefined}
     */
    collectByConsumingStateChanges(stateChanges, fromLatest = false) {
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
    consumeAll(fromLatest) {
        return this._stateChanges.consumeAll(fromLatest);
    }

    /**
     * @param fromLatest {boolean|undefined}
     * @return {StateChange[]}
     */
    peekAll(fromLatest) {
        return this._stateChanges.changes.peekAll(fromLatest);
    }

    /**
     * @param fromLatest {boolean|undefined}
     * @return {StateChange}
     */
    peekOne(fromLatest) {
        return this._stateChanges.changes.peekOne(fromLatest);
    }

    get stateChanges() {
        return this._stateChanges;
    }

    reset() {
        this._stateChanges = new StateChanges();
    }
}