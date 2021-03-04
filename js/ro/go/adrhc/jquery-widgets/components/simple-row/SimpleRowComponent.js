/**
 * "state" is a RowValues
 */
class SimpleRowComponent extends AbstractComponent {
    /**
     * @type {SimpleRowView}
     */
    simpleRowView;
    /**
     * @type {AbstractComponent}
     */
    errorComponent;

    /**
     * @param state {TaggingStateHolder}
     * @param view {SimpleRowView}
     * @param [errorComponent] {AbstractComponent}
     */
    constructor(state, view, errorComponent) {
        super(state, view);
        this.simpleRowView = view;
        this.errorComponent = errorComponent;
    }

    /**
     * Overloads super.update.
     *
     * @param {*} [columnValues]
     * @param {number} [rowIndex]
     * @return {Promise<StateChange[]>}
     */
    updateRow(columnValues, rowIndex = this._defaultRowPosition()) {
        const rowValues = columnValues ? new RowValues(columnValues, rowIndex) : undefined;
        return super.update(rowValues, {});
    }

    /**
     * @return {number}
     * @protected
     */
    _defaultRowPosition() {
        return this.simpleRowView.tableRelativePositionOnCreate === "prepend" ? 0 : TableElementAdapter.LAST_ROW_INDEX;
    }

    /**
     * @param stateChange {StateChange}
     * @return {Promise<StateChange>}
     */
    updateViewOnDELETE(stateChange) {
        this.simpleRowView.deleteRowByDataId(stateChange.previousStateOrPart.values.id);
        if (this.childishBehaviour) {
            this.childishBehaviour.detachChild();
        }
        this.reset(); // kids are also reset
        return Promise.resolve(stateChange);
    }

    /**
     * @param stateChange {StateChange}
     * @return {Promise<*>|Promise<StateChange[]>}
     */
    updateViewOnERROR(stateChange) {
        if (this.errorComponent) {
            console.log(`${this.constructor.name}.updateViewOnERROR:\n${JSON.stringify(stateChange)}`);
            stateChange.changeType = "CREATE"; // allows to create the row if doesn't exist
            this.errorComponent.state.collectStateChange(stateChange, {});
            return this.errorComponent.init();
        } else {
            alert(`${stateChange.stateOrPart.message}\n${JSON.stringify(stateChange, null, 2)}`);
        }
        return super.updateViewOnERROR(stateChange);
    }

    /**
     * Because the IdentifiableRowComponent is completely recreated on update I have to basically init it here.
     *
     * @param {StateChange} stateChange
     * @return {Promise}
     */
    updateViewOnAny(stateChange) {
        this._safelyLogStateChange(stateChange, "updateViewOnAny");
        // why reset? because we have to detach the event handlers on previous row
        this.reset();
        // above reset will also apply to the state so we must restore it (the state)
        this.state.replaceEntirely(stateChange.stateOrPart, true);
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