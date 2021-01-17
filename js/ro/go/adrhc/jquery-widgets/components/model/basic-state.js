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
     * @param fromNewestToOldest {boolean|undefined}
     * @return {StateChange[]}
     */
    peekAll(fromNewestToOldest) {
        return this._stateChanges.changes.peekAll(fromNewestToOldest);
    }

    findFirstFromNewest(predicate) {
        return this._stateChanges.changes.findFirstFromBack(predicate);
    }

    get stateChanges() {
        return this._stateChanges;
    }

    reset() {
        this._stateChanges = new StateChanges();
    }
}