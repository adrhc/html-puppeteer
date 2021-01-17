class SimpleRowComponent extends AbstractComponent {
    /**
     * @type {SimpleRowState}
     */
    simpleRowState;
    /**
     * @type {SimpleRowView}
     */
    simpleRowView;

    /**
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(state, view) {
        super(state, view);
        this.simpleRowState = state;
        this.simpleRowView = view;
    }

    /**
     * Updates the state then the view based on state changes.
     *
     * @param item
     * @param requestType {"CREATE"|"UPDATE"}
     * @param afterItemId {number|string}
     * @return {Promise<StateChange[]>}
     */
    update(item, requestType = "UPDATE", afterItemId) {
        const stateChange = new PositionStateChange(requestType, item, afterItemId);
        return this.process(stateChange);
    }

    /**
     * @param stateChange {StateChange}
     * @return {Promise<StateChange>}
     */
    updateViewOnDELETE(stateChange) {
        this.reset(); // kids are also reset
        this.simpleRowView.deleteRowByDataId(stateChange.data.id);
        return Promise.resolve(stateChange);
    }

    /**
     * After deletion the kids will be also removed so initKids will have no effect (which is good).
     *
     * @param stateUpdaterFn {function(state: BasicState)}
     * @param delayViewUpdate {boolean} whether to (immediately) update the view based or not
     * @return {Promise<StateChange[]>}
     */
    doWithState(stateUpdaterFn, delayViewUpdate) {
        return super.doWithState(stateUpdaterFn, delayViewUpdate)
            .then(stateChanges => {
                if (this._isLastStateChangeADelete(stateChanges)) {
                    return stateChanges;
                }
                // todo: reconsider whether to initKids after every doWithState call
                return this.initKids().then(() => stateChanges);
            });
    }

    /**
     * @param stateChanges {StateChange[]}
     * @return {boolean} whether the last change in stateChanges is a DELETE
     * @protected
     */
    _isLastStateChangeADelete(stateChanges) {
        const lastStateChange = stateChanges && stateChanges.length ? stateChanges[stateChanges.length - 1] : undefined;
        return lastStateChange && lastStateChange.requestType === "DELETE";
    }

    init() {
        if (this.simpleRowState.rowState) {
            return this.updateViewOnStateChanges().then(() => this.initKids());
        } else {
            return this.updateViewOnStateChanges();
        }
    }
}