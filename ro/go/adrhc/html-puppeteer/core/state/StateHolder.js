import StateChangesCollector from "./StateChangesCollector.js";
import StateChange from "./change/StateChange.js";

/**
 * @template SCT
 * @typedef {Object} StateHolderOptions
 * @property {StateChangeEnhancer<SCT>=} stateChangeEnhancer
 * @property {StateChangesCollector<SCT>=} stateChangesCollector
 */
export default class StateHolder {
    /**
     * @type {SCT}
     * @protected
     */
    _currentState;
    /**
     * @type {Bag}
     */
    config;

    /**
     * @type {StateChangesCollector<SCT>}
     * @protected
     */
    _stateChangesCollector;

    /**
     * @return {StateChangesCollector<SCT>}
     */
    get stateChangesCollector() {
        return this._stateChangesCollector;
    }

    /**
     * @return {SCT}
     */
    get stateCopy() {
        return this._currentState == null ? this._currentState : _.cloneDeep(this._currentState);
    }

    /**
     * @param {StateHolderOptions=} options
     * @param {Bag=} restOfOptions
     * @constructor
     */
    constructor({stateChangeEnhancer, stateChangesCollector, ...restOfOptions}) {
        this.config = restOfOptions;
        this._stateChangesCollector = stateChangesCollector ?? new StateChangesCollector(stateChangeEnhancer);
    }

    /**
     * @return {boolean}
     */
    hasNull() {
        return this._currentState == null;
    }

    /**
     * @return {boolean}
     */
    hasUndefined() {
        return typeof this._currentState === "undefined";
    }

    /**
     * @param {SCT=} newState
     * @param {boolean=} dontRecordChanges
     * @return {StateChange<SCT>[]} the newly created StateChange or, if dontRecordChanges = true, whether a state change occurred
     */
    replace(newState, dontRecordChanges) {
        if (this._currentStateEquals(newState)) {
            return [];
        }

        const previousState = this._replaceImpl(newState);

        // cloning because a subsequent partial change might alter the _currentState
        // which now is newState hence the stateChanges below might be altered too
        const clonedNewState = _.cloneDeep(newState);

        const stateChanges = this._stateChangesOf(previousState, clonedNewState);

        if (dontRecordChanges) {
            return stateChanges;
        }

        return this._collectStateChanges(stateChanges);
    }

    /**
     * @param {SCT=} previousState
     * @param {SCT=} newState
     * @return {StateChange<SCT>[]}
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
     * @param {StateChange<SCT>[]=} stateChanges
     * @return {StateChange<SCT>[]}
     * @protected
     */
    _collectStateChanges(stateChanges = []) {
        return stateChanges.map(sc => this.stateChangesCollector.collect(sc)).filter(it => it != null);
    }

    /**
     * @param {StateChange<SCT>[]=} stateChanges
     * @return {StateChange<SCT>[]}
     * @protected
     */
    _enhanceStateChanges(stateChanges = []) {
        return stateChanges.map(sc => this.stateChangesCollector.enhance(sc)).filter(it => it != null);
    }

    /**
     * @return {StateChange<SCT>[]}
     */
    cancelAllStateChanges() {
        return this.stateChangesCollector.consumeAll();
    }
}