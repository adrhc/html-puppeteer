class BasicState {
    /**
     * @type {StateChanges}
     * @private
     */
    _stateChanges = new StateChanges();
    /**
     * @private
     */
    _currentState;

    /**
     * @param currentState
     */
    constructor(currentState) {
        this._currentState = currentState;
    }

    get currentState() {
        return this._currentState;
    }

    /**
     * @param {StateChange} stateChange
     * @param {boolean} [updateCurrentStateButDontCollectStateChange]
     */
    collectStateChange(stateChange, updateCurrentStateButDontCollectStateChange) {
        this._currentState = stateChange.data;
        if (!updateCurrentStateButDontCollectStateChange) {
            this._stateChanges.collect(stateChange);
        }
    }

    /**
     * @param simpleError {SimpleError}
     * @param requestType {string}
     * @param [entity] {IdentifiableEntity}
     */
    collectFromSimpleError(simpleError, requestType, entity) {
        AssertionUtils.isTrue(!entity || entity === simpleError.data);
        let failedId = !!entity.id ? entity.id : IdentifiableEntity.TRANSIENT_ID;
        const data = $.extend(true, {
            // id is used to identify the row to update and for setting the "data-id" attribute
            id: `error-row-${failedId}`,
            // failedId is used for setting "data-secondary-row-part" attribute
            failedId,
            entity: simpleError.data,
            failedRequestType: requestType
        }, simpleError);
        // avoid storing state while collecting error-based state changes
        this._stateChanges.collect(new PositionStateChange("ERROR", data, undefined, failedId));
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
        this._currentState = undefined;
    }
}