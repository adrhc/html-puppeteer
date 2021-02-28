class BasicState {
    /**
     * @type {ChangeManager}
     * @protected
     */
    _stateChanges;
    /**
     * @type {*}
     * @protected
     */
    _currentState;

    /**
     * @param {*} [currentState]
     * @param {ChangeManager} [ChangeManager]
     */
    constructor(currentState, {changeManager = new ChangeManager()}) {
        this._currentState = currentState;
        this._stateChanges = changeManager;
    }

    /**
     * Completely replaces the state; it'll be a DELETE if state == null.
     *
     * @param {*} state is the new state value to store
     * @param {boolean} [dontRecordStateEvents]
     * @return {StateChange}
     */
    replace(state, dontRecordStateEvents) {
        if (this._isChangeTypeOfDelete(state)) {
            return this.delete(dontRecordStateEvents);
        }
        if (this._currentStateEquals(state)) {
            return undefined;
        }

        const changeType = this.changeTypeOf(state);
        this._currentState = state;

        if (dontRecordStateEvents) {
            return undefined;
        }

        const stateChange = new StateChange(changeType, state);
        this._stateChanges.collect(stateChange);
        return stateChange;
    }

    /**
     * Removes the current state (i.e. sets it to undefined).
     *
     * @param {boolean} [dontRecordStateEvents]
     * @return {StateChange}
     */
    delete(dontRecordStateEvents) {
        if (this._isStatePristine()) {
            return undefined;
        }
        this._currentState = undefined;
        if (dontRecordStateEvents) {
            return undefined;
        }
        const stateChange = new DeleteStateChange(this._currentState);
        this._stateChanges.collect(stateChange);
        return stateChange;
    }

    /**
     * Partially changes the state (aka creates/deletes/replaces a state part/portion/section).
     * It'll be a DELETE if state == null.
     *
     * @param {*} partialState
     * @param {string} partName specify the state's part/section to change/manipulate
     * @param {boolean} [dontRecordStateEvents]
     * @return {StateChange}
     */
    replacePart(partialState, partName, dontRecordStateEvents) {
        if (this._isChangeTypeOfDelete(partialState, partName)) {
            return this.deletePart(partName, dontRecordStateEvents);
        }
        if (this._currentStatePartEquals(partialState, partName)) {
            return undefined;
        }

        const changeType = this.changeTypeOf(partialState, partName);
        this._replacePartImpl(partialState, partName);

        if (dontRecordStateEvents) {
            return undefined;
        }

        const stateChange = new StateChange(changeType, partialState, partName);
        this._stateChanges.collect(stateChange);
        return stateChange;
    }

    /**
     * @param {*} partialState
     * @param {string} partName specify the state's part/section to change/manipulate
     */
    _replacePartImpl(partialState, partName) {
        const changeType = this.changeTypeOf(partialState);
        console.debug(`${this.constructor.name}._replacePartImpl, ${partName} ${changeType}, new part:\n${JSON.stringify(partialState)}`);
        this._currentState[partName] = partialState;
    }

    /**
     * @param {string} [partName] specify the state's part/section to change/manipulate
     * @param {boolean} [dontRecordStateEvents]
     */
    deletePart(partName, dontRecordStateEvents) {
        if (this._isStatePartPristine(partName)) {
            return undefined;
        }
        this._deletePartImpl(partName);

        if (dontRecordStateEvents) {
            return undefined;
        }

        const stateChange = new DeleteStateChange(this.getStatePart(partName), partName);
        this._stateChanges.collect(stateChange);
        return stateChange;
    }

    /**
     * @param {string} [partName] specify the state's part/section to change/manipulate
     * @private
     */
    _deletePartImpl(partName) {
        console.debug(`${this.constructor.name}._deletePartImpl, ${partName}, currently:\n${JSON.stringify(this._currentState[partName])}`);
        this._currentState[partName] = undefined;
    }

    /**
     * @param {*} state is the new state value to store
     * @param {string} [partName] specify the state's part/section to change/manipulate
     * @return {"CREATE"|"DELETE"|"REPLACE"} the change type
     * @protected
     */
    changeTypeOf(state, partName) {
        if (this._isChangeTypeOfDelete(state, partName)) {
            return "DELETE";
        } else if (this._isStatePristine(state)) {
            return "CREATE";
        } else {
            return "REPLACE";
        }
    }

    /**
     * todo: move this error state to an error related BasicState instance
     *
     * @param {SimpleError} simpleError
     * @param {string} changeType
     * @param {IdentifiableEntity} [entity]
     */
    collectFromSimpleError(simpleError, changeType, entity) {
        AssertionUtils.isTrue(!entity || entity === simpleError.data);
        let failedId = !!entity.id ? entity.id : IdentifiableEntity.TRANSIENT_ID;
        const data = $.extend(true, {
            // id is used to identify the row to update and for setting the "data-id" attribute
            id: `error-row-${failedId}`,
            // failedId is used for setting "data-secondary-row-part" attribute
            failedId,
            entity: simpleError.data,
            failedRequestType: changeType
        }, simpleError);
        // avoid storing state while collecting error-based state changes
        this._stateChanges.collect(new PositionStateChange("ERROR", data, {beforeItemId: failedId}));
    }

    /**
     *
     * @param {string} state
     * @param {string} [partName] specify the state's part/section to change/manipulate
     * @return {boolean}
     * @private
     */
    _isChangeTypeOfDelete(state, partName) {
        if (partName) {
            return this._isStatePartPristine(partName, state);
        } else {
            return this._isStatePristine(state);
        }
    }

    _isStatePristine(state = this._currentState) {
        return state == null;
    }

    /**
     * @param {string} partName specify the state's part/section to change/manipulate
     * @param {*} [part]
     * @return {boolean}
     * @protected
     */
    _isStatePartPristine(partName, part = this.getStatePart(partName)) {
        return part == null;
    }

    /**
     * @param anotherState
     * @return {boolean}
     * @protected
     */
    _currentStateEquals(anotherState) {
        return this._currentState === anotherState;
    }

    /**
     * @param {*} part
     * @param {string} partName specify the state's part/section to change/manipulate
     * @return {boolean}
     * @protected
     */
    _currentStatePartEquals(part, partName) {
        return this.getStatePart(partName) === part;
    }

    /**
     * @param {string} [partName] specify the state's part/section to get
     * @return {*}
     */
    getStatePart(partName) {
        if (this._currentState == null) {
            return undefined;
        }
        return this._currentState[partName];
    }

    get currentState() {
        return this._currentState;
    }

    set currentState(currentState) {
        this._currentState = currentState;
    }

    get stateChanges() {
        return this._stateChanges;
    }

    reset() {
        this._stateChanges.reset();
        this._currentState = undefined;
    }
}