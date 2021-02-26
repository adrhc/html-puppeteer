class BasicState {
    /**
     * @type {StateChanges}
     * @protected
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

    set currentState(currentState) {
        this._currentState = currentState;
    }

    /**
     * This could be a partial state update so we can't set _currentState.
     *
     * @param {StateChange} stateChange
     * @param {boolean} [dontRecordStateEvents]
     * @param {boolean} [overwriteState]
     */
    collectStateChange(stateChange, {dontRecordStateEvents, overwriteState}) {
        if (overwriteState) {
            this._currentState = stateChange.data;
        } else {
            let {data: partialState, requestType: changeType, partName} = stateChange;
            this._changeStatePart(partialState, changeType, partName);
        }
        if (!dontRecordStateEvents) {
            this._stateChanges.collect(stateChange);
        }
    }

    /**
     * Completely replaces the state.
     *
     * @param {*} state is the new state value to store
     * @param {boolean} [dontRecordStateEvents]
     * @return {boolean} whether a state change occurred or not
     */
    replace(state, dontRecordStateEvents) {
        if (this.equals(state)) {
            return false;
        }
        const changeType = this._changeTypeOf(state);
        this.collectStateChange(new StateChange(changeType, state), {dontRecordStateEvents, overwriteState: true})
    }

    /**
     * Partially changes the state (aka creates/deletes/replaces a state part/portion/section).
     *
     * @param {*} partialState
     * @param {"CREATE"|"DELETE"|"REPLACE"} changeType specify the state-part change type
     * @param {string} partName specify the state's part/section to change/manipulate
     * @param {boolean} [dontRecordStateEvents]
     * @return {boolean} whether a state change occurred or not
     */
    patch(partialState, changeType, partName, dontRecordStateEvents) {
        if (this.contains(partialState)) {
            return false;
        }
        this.collectStateChange(new StateChange(changeType, partialState, partName), {dontRecordStateEvents})
    }

    /**
     * Removes the current state (aka set it to undefined)
     *
     * @param {boolean} [dontRecordStateEvents]
     * @return {boolean}
     */
    delete(dontRecordStateEvents) {
        if (this._currentState == null) {
            return false;
        }
        this.collectStateChange(new StateChange("DELETE"), {dontRecordStateEvents, overwriteState: true})
    }

    /**
     * @param {*} partialState
     * @param {"CREATE"|"DELETE"|"REPLACE"} changeType specify the state-part change type
     * @param {string} [partName] specify the state's part/section to change/manipulate
     * @protected
     */
    _changeStatePart(partialState, changeType, partName) {
        console.debug(`${this.constructor.name}._changeStatePart, ignoring ${!!partName ? partName : ''} ${changeType}:\n${JSON.stringify(partialState)}`);
    }

    /**
     * @param {!*} state is the new state value to store
     * @return {!string} the change type
     * @protected
     */
    _changeTypeOf(state) {
        if (this._currentState == null) {
            return "CREATE";
        } else if (state == null) {
            return "DELETE";
        } else {
            return "REPLACE";
        }
    }

    /**
     * todo: move this to an error component or at least to another (error) state instance
     *
     * @param {SimpleError} simpleError
     * @param {string} requestType
     * @param {IdentifiableEntity} [entity]
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
        this._stateChanges.collect(new PositionStateChange("ERROR", data, {beforeItemId: failedId}));
    }

    /**
     * @param stateChanges {StateChanges}
     * @param fromNewest {boolean|undefined}
     */
    collectByConsumingStateChanges(stateChanges, fromNewest = false) {
        stateChanges.consumeAll(fromNewest).forEach(stateChange => this.collectStateChange(stateChange, {}));
    }

    /**
     * discards one previously recorded state change, the newest or earliest one, depending on @param fromNewest
     *
     * @param {boolean} fromNewest
     * @return {StateChange} the discarded state change
     */
    consumeOne(fromNewest = false) {
        return this._stateChanges.consumeOne(fromNewest);
    }

    /**
     * discards all previously recorded state changes, starting with the newest or earliest one, depending on @param fromNewest
     *
     * @param {boolean} [fromNewest]
     * @return {StateChange[]} the discarded state changes
     */
    consumeAll(fromNewest) {
        return this._stateChanges.consumeAll(fromNewest);
    }

    /**
     * @param {boolean} [fromNewestToOldest]
     * @return {StateChange[]}
     */
    peekAll(fromNewestToOldest) {
        return this._stateChanges.changes.peekAll(fromNewestToOldest);
    }

    /**
     * @param {function(stateChange: StateChange): boolean} predicate
     * @return {undefined|*}
     */
    findFirstFromNewest(predicate) {
        return this._stateChanges.changes.findFirstFromBack(predicate);
    }

    /**
     * @param anotherState
     * @return {boolean}
     * @protected
     */
    equals(anotherState) {
        return this._currentState === anotherState;
    }

    /**
     * @param anotherState
     * @return {boolean}
     * @protected
     */
    contains(anotherState) {
        return false;
    }

    get stateChanges() {
        return this._stateChanges;
    }

    reset() {
        this._stateChanges = new StateChanges();
        this._currentState = undefined;
    }
}