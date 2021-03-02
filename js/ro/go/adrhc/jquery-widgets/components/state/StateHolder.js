class StateHolder {
    /**
     * @type {StateChangesCollector}
     * @protected
     */
    _stateChanges;
    /**
     * @type {*}
     * @protected
     */
    _currentState;

    /**
     * @param {*} [initialState]
     * @param {IdentityStateChangeMapper} [stateChangeMapper]
     * @param {StateChangesCollector} [changesCollector]
     */
    constructor({
                    initialState,
                    stateChangeMapper = new IdentityStateChangeMapper(),
                    changesCollector = new StateChangesCollector(stateChangeMapper)
                }) {
        this._currentState = initialState;
        this._stateChanges = changesCollector;
    }

    /**
     * @param {*} state is the new state value to store
     * @param {boolean} [dontRecordStateEvents]
     * @return {StateChange}
     */
    replace(state, dontRecordStateEvents) {
        if (this._currentStateEquals(state)) {
            return undefined;
        }

        const previousState = this._replaceImpl(state);

        if (dontRecordStateEvents) {
            return undefined;
        }

        const stateChange = new StateChange(previousState, state);
        return this._stateChanges.collect(stateChange);
    }

    /**
     * @param {*} state is the new state value to store
     * @return {*} previous state
     * @protected
     */
    _replaceImpl(state) {
        const previousState = this._currentState;
        this._currentState = state;
        return previousState;
    }

    /**
     * Partially changes the state (aka creates/deletes/replaces a state part/portion/section).
     *
     * @param {*} partialState
     * @param {string|number} partName specify the state's part/section to change/manipulate
     * @param {boolean} [dontRecordStateEvents]
     * @return {StateChange}
     */
    replacePart(partialState, partName, dontRecordStateEvents) {
        if (this._currentStatePartEquals(partialState, partName)) {
            return undefined;
        }

        const previousStatePart = this._replacePartImpl(partialState, partName);

        if (dontRecordStateEvents) {
            return undefined;
        }

        const stateChange = new StateChange(previousStatePart, partialState, partName);
        return this._stateChanges.collect(stateChange);
    }

    /**
     * @param {*} partialState
     * @param {string|number} partName specify the state's part/section to change/manipulate
     * @return {*} previous state part
     * @protected
     */
    _replacePartImpl(partialState, partName) {
        console.debug(`${this.constructor.name}._replacePartImpl, ${partName}, new part:\n${JSON.stringify(partialState)}`);
        const previousStatePart = this.getStatePart(partName);
        this._currentState[partName] = partialState;
        return previousStatePart;
    }

    /**
     * todo: move this error state to an error related StateHolder instance
     *
     * @param {SimpleError} simpleError
     * @param {string} changeType
     * @param {IdentifiableEntity} [entity]
     */
    collectFromSimpleError(simpleError, changeType, entity) {
        AssertionUtils.isTrue(!entity || entity === simpleError.data);
        let failedId = !!entity.id ? entity.id : IdentifiableEntity.TRANSIENT_ID;
        const data = $.extend({
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
     * @param anotherState
     * @return {boolean}
     * @protected
     */
    _currentStateEquals(anotherState) {
        return this._currentState === anotherState;
    }

    /**
     * @param {*} part
     * @param {string|number} partName specify the state's part/section to change/manipulate
     * @return {boolean}
     * @protected
     */
    _currentStatePartEquals(part, partName) {
        return this.getStatePart(partName) === part;
    }

    /**
     * @param {string|number} [partName] specify the state's part/section to get
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