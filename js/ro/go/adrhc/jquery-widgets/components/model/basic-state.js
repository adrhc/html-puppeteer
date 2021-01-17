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
     * @param fromNewest {boolean|undefined}
     */
    collectByConsumingStateChanges(stateChanges, fromNewest = false) {
        stateChanges.consumeAll(fromNewest).forEach(stateChange => this.collectStateChange(stateChange));
    }

    /**
     * @param fromNewest {boolean|undefined}
     * @return {StateChange}
     */
    consumeOne(fromNewest = false) {
        return this._stateChanges.consumeOne(fromNewest);
    }

    /**
     * @param fromNewest {boolean|undefined}
     * @return {StateChange[]}
     */
    consumeAll(fromNewest) {
        return this._stateChanges.consumeAll(fromNewest);
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