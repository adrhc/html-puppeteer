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
     * Updates the state and the view based on the provided parameters.
     * CREATE won't do what init() does: e.g. it won't initKids or
     * configure events, only init() should do that!
     *
     * @param item
     * @param [requestType] {"CREATE"|"UPDATE"|"DELETE"}
     * @param [afterItemId] {number|string}
     * @return {Promise<StateChange[]>}
     */
    update(item, requestType = "UPDATE", afterItemId) {
        const stateChange = new PositionStateChange(requestType, item, afterItemId);
        return this.processStateChange(stateChange);
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

    init() {
        if (this.simpleRowState.rowState) {
            return this.updateViewOnStateChanges().then(() => this.initKids());
        } else {
            return this.updateViewOnStateChanges();
        }
    }
}