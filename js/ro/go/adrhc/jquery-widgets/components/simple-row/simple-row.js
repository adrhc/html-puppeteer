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
     * @return {Promise<StateChange>}
     */
    update(item, requestType = "UPDATE", afterItemId) {
        this.simpleRowState.update(item, requestType, afterItemId);
        return this.updateViewOnStateChange()
            .then(stateChange => this.initKids().then(() => stateChange));
    }

    /**
     * @param stateChange {StateChange}
     * @return {Promise<StateChange>}
     */
    updateViewOnDELETE(stateChange) {
        this.close();
        this.simpleRowView.deleteRowByDataId(stateChange.data.id);
        return Promise.resolve(stateChange);
    }
}