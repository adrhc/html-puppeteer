import StateChangesCollector from "./StateChangesCollector.js";
import StateChange from "./change/StateChange.js";

/**
 * @template SCT
 * @typedef {Object} StateHolderOptions
 * @property {StateChangeEnhancer<SCT, SCT>=} stateChangeEnhancer
 * @property {StateChangesCollector<SCT, SCT>=} stateChangesCollector
 */
export default class StateHolder {
    /**
     * @type {SCT}
     * @protected
     */
    _currentState;

    /**
     * @return {SCT}
     */
    get currentState() {
        return this._currentState;
    }

    /**
     * @param {SCT} currentState
     */
    set currentState(currentState) {
        this._currentState = currentState;
    }

    /**
     * @type {StateChangesCollector<SCT, SCT>}
     * @protected
     */
    _stateChangesCollector;

    /**
     * @return {StateChangesCollector<SCT, SCT>}
     */
    get stateChangesCollector() {
        return this._stateChangesCollector;
    }

    /**
     * @param {StateHolderOptions=} options
     * @constructor
     */
    constructor({stateChangeEnhancer, stateChangesCollector}) {
        this._stateChangesCollector = stateChangesCollector ?? new StateChangesCollector(stateChangeEnhancer);
    }

    /**
     * @param {SCT=} newState
     * @param {boolean=} dontRecordChanges
     * @return {StateChange<SCT, SCT>|boolean} the newly created StateChange or, if dontRecordChanges = true, whether a state change occurred
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
     * @param {SCT=} previousState
     * @param {SCT=} newState
     * @return {StateChange<SCT, SCT>[]}
     * @protected
     */
    _stateChangesOf(previousState, newState) {
        return [new StateChange(previousState, newState)];
    }

    /**
     * @param {SCT} [newState] is the new state value to store
     * @return {SCT} the previous state
     * @protected
     */
    _replaceImpl(newState) {
        const previousState = this._currentState;
        this._currentState = newState;
        return previousState;
    }

    /**
     * @param {SCT=} anotherState
     * @return {boolean}
     * @protected
     */
    _currentStateEquals(anotherState) {
        return this._currentState == null && anotherState == null || this._currentState === anotherState;
    }

    /**
     * @return {StateChange<SCT, SCT>[]|undefined}
     */
    collectStateChanges(stateChanges) {
        return stateChanges.map(sc => this.stateChangesCollector.collect(sc)).filter(it => it != null);
    }
}