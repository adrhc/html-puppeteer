import StateChangesCollector from "./StateChangesCollector.js";
import StateChange from "./StateChange.js";

/**
 * @template SHT
 * @typedef {SHT} SCT
 * @typedef {SHT} SCP
 */
export default class StateHolder {
    /**
     * @type {SHT}
     * @protected
     */
    _currentState;

    /**
     * @return {SHT}
     */
    get currentState() {
        return this._currentState;
    }

    /**
     * @param {SHT} currentState
     */
    set currentState(currentState) {
        this._currentState = currentState;
    }

    /**
     * @type {StateChangesCollector}
     * @protected
     */
    _stateChangesCollector;

    /**
     * @return {StateChangesCollector}
     */
    get stateChangesCollector() {
        return this._stateChangesCollector;
    }

    /**
     * @param {{stateChangeEnhancer: undefined|StateChangeEnhancer, stateChangesCollector: undefined|StateChangesCollector=}} [options]
     */
    constructor({stateChangeEnhancer, stateChangesCollector} = {}) {
        this._stateChangesCollector = stateChangesCollector ?? new StateChangesCollector(stateChangeEnhancer);
    }

    /**
     * @param {SHT=} newState
     * @param {boolean=} dontRecordChanges
     * @return {StateChange<SHT, SHT>|boolean} the newly created StateChange or, if dontRecordChanges = true, whether a state change occurred
     */
    replace(newState, dontRecordChanges) {
        if (this._currentStateEquals(newState)) {
            return false;
        }

        const previousState = this._replaceImpl(newState);

        if (dontRecordChanges) {
            return true;
        }

        const stateChanges = this._stateChangesOf(previousState, newState);

        return this.collectStateChanges(stateChanges);
    }

    /**
     * @param {SHT=} previousState
     * @param {SHT=} newState
     * @return {StateChange<SHT, SHT>[]}
     * @protected
     */
    _stateChangesOf(previousState, newState) {
        return [new StateChange(previousState, newState)];
    }

    /**
     * @param {SHT} [newState] is the new state value to store
     * @return {SHT} the previous state
     * @protected
     */
    _replaceImpl(newState) {
        const previousState = this._currentState;
        this._currentState = newState;
        return previousState;
    }

    /**
     * @param {SHT=} anotherState
     * @return {boolean}
     * @protected
     */
    _currentStateEquals(anotherState) {
        return this._currentState == null && anotherState == null || this._currentState === anotherState;
    }

    /**
     * @return {StateChange<SHT, SHT>[]|undefined}
     */
    collectStateChanges(stateChanges) {
        return stateChanges.map(sc => this.stateChangesCollector.collect(sc)).filter(it => it != null);
    }
}