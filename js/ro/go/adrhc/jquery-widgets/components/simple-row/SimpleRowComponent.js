/**
 * "state" is a EntityRow
 */
class SimpleRowComponent extends AbstractComponent {
    /**
     * @type {SimpleRowView}
     */
    simpleRowView;

    /**
     * @param tableIdOrJQuery
     * @param rowTmplId
     * @param rowTmplHtml
     * @param childProperty
     * @param mustacheTableElemAdapter
     * @param tableRelativePositionOnCreate
     * @param initialState
     * @param {TaggingStateHolder} state
     * @param {SimpleRowView=} view
     * @param childCompFactories
     * @param childishBehaviour
     * @param {ComponentConfiguration=} config
     */
    constructor({
                    tableIdOrJQuery,
                    rowTmplId,
                    rowTmplHtml,
                    childProperty,
                    config = ComponentConfiguration.configWithOverrides(
                        tableIdOrJQuery, DomUtils.dataOf(rowTmplId), {
                            rowTmplId,
                            rowTmplHtml,
                            childProperty
                        }),
                    mustacheTableElemAdapter = new MustacheTableElemAdapter(tableIdOrJQuery, rowTmplId, rowTmplHtml),
                    tableRelativePositionOnCreate,
                    view = new SimpleRowView(mustacheTableElemAdapter, tableRelativePositionOnCreate),
                    initialState,
                    state = new TaggingStateHolder({initialState}),
                    childCompFactories,
                    childishBehaviour
                }) {
        super({view, state, childishBehaviour, config: config.dontAutoInitializeOf()});
        this.config = config;
        if (childCompFactories) {
            this.compositeBehaviour.addChildComponentFactory(childCompFactories);
        }
        this.simpleRowView = view;
    }

    /**
     * Overloads super.update.
     *
     * @param {*} [columnValues]
     * @param {number} [rowIndex]
     * @return {Promise<StateChange[]>}
     */
    updateRow(columnValues, rowIndex = this._defaultRowPosition()) {
        const rowValues = columnValues ? new EntityRow(columnValues, rowIndex) : undefined;
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
        this.simpleRowView.deleteRowByDataId(stateChange.previousStateOrPart.entity.id);
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
    /*updateViewOnERROR(stateChange) {
        if (this.errorComponent) {
            console.log(`${this.constructor.name}.updateViewOnERROR:\n${JSON.stringify(stateChange)}`);
            const errorRow = stateChange.stateOrPart;
            const errorStateChange = new CreateStateChange(errorRow)
            return this.errorComponent.processStateChanges(errorStateChange);
        } else {
            alert(`${stateChange.stateOrPart.message}\n${JSON.stringify(stateChange, null, 2)}`);
        }
        return Promise.resolve(stateChange);
    }*/

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
        this.state.currentState = stateChange.stateOrPart;
        // after recreating the view one has to again bind the event handlers,
        // call compositeBehaviour.init, etc (do something similar to an init)
        return this.view.update(stateChange)
            .then(() => {
                // the this.view.$elem is set only after this.view.update so we have to _configureEvents after it
                this._configureEvents();
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