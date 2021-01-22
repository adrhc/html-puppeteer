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
     * @type {AbstractComponent}
     */
    errorComponent;

    /**
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     * @param [errorComponent] {AbstractComponent}
     */
    constructor(state, view, errorComponent) {
        super(state, view);
        this.simpleRowState = state;
        this.simpleRowView = view;
        this.errorComponent = errorComponent;
    }

    /**
     * Updates the state and the view based on the provided parameters.
     * For CREATE won't do what init() does: e.g. it won't compositeBehaviour.init
     * or configure events, only init() should do that!
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
        this.simpleRowView.deleteRowByDataId(stateChange.data.id);
        if (this.childishBehaviour) {
            this.childishBehaviour.detachChild();
        }
        this.reset(); // kids are also reset
        return Promise.resolve(stateChange);
    }

    updateViewOnERROR(stateChange) {
        if (this.errorComponent) {
            console.log(`${this.constructor.name}.updateViewOnERROR:\n${JSON.stringify(stateChange)}`);
            this.errorComponent.state.collectErrorStateChange(stateChange);
            return this.errorComponent.init();
        }
        return super.updateViewOnERROR(stateChange);
    }

    /**
     * Because the IdentifiableRowComponent is completely recreated on update I have to basically init it here.
     *
     * @param stateChange
     * @return {Promise}
     */
    updateViewOnAny(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnAny:\n${JSON.stringify(stateChange)}`);
        // why reset? because we have to detach the event handlers on previous row
        this.reset();
        // above reset will also apply to the state so we must restore it (the state)
        this.state.collectStateChange(stateChange, true);
        // after recreating the view one has to again bind the event handlers,
        // call compositeBehaviour.init, etc (do something similar to an init)
        return this.view.update(stateChange)
            .then(() => {
                // the this.view.$elem is set only after this.view.update so we have to configureEvents after it
                this.configureEvents();
                return this.compositeBehaviour.init();
            });
    }

    /**
     * It's not necessary to call compositeBehaviour.init because it is called by this.updateViewOnAny.
     *
     * @return {Promise<StateChange[]>}
     */
    init() {
        return this.updateViewOnStateChanges();
    }
}