/**
 * @template T
 */
class StateHolder {
    /**
     * @type {StateChangesCollector<T|T>}
     * @protected
     */
    _stateChanges;

    /**
     * @return {StateChangesCollector<T|T>}
     */
    get stateChanges() {
        return this._stateChanges;
    }

    /**
     * @type {T}
     * @protected
     */
    _currentState;

    /**
     * @return {T}
     */
    get currentState() {
        return this._currentState;
    }

    /**
     * @param {T} currentState
     */
    set currentState(currentState) {
        this._currentState = currentState;
    }

    /**
     * @param {{initialState: undefined|T, stateChangeMapper: undefined|IdentityStateChangeMapper<T|T>, changesCollector: undefined|StateChangesCollector<T|T>=}} [options]
     */
    constructor({initialState, stateChangeMapper, changesCollector} = {}) {
        this._currentState = initialState;
        this._stateChanges = changesCollector ?? new StateChangesCollector(
            stateChangeMapper ?? new IdentityStateChangeMapper());
    }

    /**
     * @param {T=} newState
     * @param {boolean=} dontRecordStateEvents
     * @return {StateChange<T>|boolean} the newly created StateChange or, if dontRecordStateEvents = true, whether a state change occurred
     */
    replace(newState, dontRecordStateEvents) {
        if (this._currentStateEquals(newState)) {
            return false;
        }

        const previousState = this._replaceImpl(newState);

        if (dontRecordStateEvents) {
            return true;
        }

        const stateChanges = this._stateChangesOf(previousState, newState);

        return this.collectStateChanges(stateChanges);
    }

    /**
     * @param {T=} previousState
     * @param {T=} newState
     * @return {StateChange<T>[]}
     * @protected
     */
    _stateChangesOf(previousState, newState) {
        return [new StateChange(previousState, newState)];
    }

    /**
     * @param {T} [state] is the new state value to store
     * @return {T} the previous state
     * @protected
     */
    _replaceImpl(state) {
        const previousState = this._currentState;
        this._currentState = state;
        return previousState;
    }

    /**
     * @param {T|T=} anotherState
     * @return {boolean}
     * @protected
     */
    _currentStateEquals(anotherState) {
        return this._currentState == null && anotherState == null || this._currentState === anotherState;
    }

    /**
     * @return {StateChange<T>[]|undefined}
     */
    collectStateChanges(stateChanges) {
        return stateChanges.map(sc => this.collectStateChange(sc));
    }

    /**
     * @return {StateChange<T>|undefined}
     */
    collectStateChange(stateChange) {
        return this._stateChanges.collect(stateChange);
    }

    reset() {
        this._stateChanges.reset();
        this._currentState = undefined;
    }
}