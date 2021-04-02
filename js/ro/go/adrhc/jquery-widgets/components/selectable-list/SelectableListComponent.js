/**
 * todo: should I reset the swappingState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL and offRow is not automatically creating the related row,
 * than the next onSwitch will determine swappingState to render as "deselected" the previous
 * item but only if already exists (in table) otherwise nothing will be rendered for it.
 */
class SelectableListComponent extends SimpleListComponent {
    /**
     * @type {SelectableListState}
     */
    selectableListState;
    /**
     * @type {SimpleListView}
     */
    simpleListView;
    /**
     * field having SelectableListEntityExtractor type instead of the generic EntityExtractor type
     *
     * @type {SelectableListEntityExtractor}
     */
    selectableListEntityExtractor;
    /**
     * @type {{}}
     */
    swappingRowSelector;

    /**
     * @param repository {CrudRepository}
     * @param state {SelectableListState}
     * @param view {SimpleListView}
     * @param offRow {IdentifiableRowComponent}
     * @param onRow {IdentifiableRowComponent}
     * @param {ComponentConfiguration} [config]
     */
    constructor(repository, state, view,
                offRow, onRow, config) {
        super(repository, state, view, config);
        this.configurePartChangeHandlers({
            handleItemChange: ["CREATE", "REPLACE", "DELETE"],
            handleItemOff: ["OFF"],
            handleItemOn: ["ON"]
        }, "Item");
        this.selectableListState = state;
        this.simpleListView = view;
        this.selectableListEntityExtractor = this.entityExtractor = new SelectableListEntityExtractor(this);
        this.swappingRowSelector = {
            ON: onRow, // e.g. editable-row, deletable-row
            OFF: offRow // i.e. read-only row
        };
        this.offRow = offRow;
    }

    /**
     * Returns the IdentifiableRowComponent dealing with an "active" selection.
     * The specific row though depend on the EntityRowSwap.context if
     * present otherwise is the this.swappingRowSelector[false].
     *
     * @return {IdentifiableRowComponent} responsible for the currently "selected" row
     */
    get selectedRowComponent() {
        const entityRowSwap = this.selectableListState.currentEntityRowSwap;
        if (!entityRowSwap) {
            return undefined;
        }
        const context = entityRowSwap.context == null ? SwitchType.ON : entityRowSwap.context;
        return this.swappingRowSelector[context];
    }

    /**
     * (existing) item selection event handler
     *
     * @param ev {Event}
     */
    onSwitch(ev) {
        const selectableList = ev.data;
        if (!$(this).is("tr,td,th")) {
            return;
        }
        ev.stopPropagation();
        const rowDataId = selectableList.simpleListView.rowDataIdOf(this);
        selectableList.switchTo(rowDataId);
    }

    /**
     * @param context {string|boolean|undefined}
     * @param rowDataId {number|string}
     * @return {Promise<StateChange[]>}
     */
    switchTo(rowDataId, context) {
        return this.doWithState(() => {
            this.selectableListState.switchTo(rowDataId, context);
        });
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<TaggedStateChange[]>}
     */
    handleItemChange(stateChange) {
        console.log(`${this.constructor.name}.handleItemChange:\n${JSON.stringify(stateChange)}`);
        return this.offRow.processStateChanges(stateChange);
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<StateChange[]>}
     */
    handleItemOff(stateChange) {
        console.log(`${this.constructor.name}.handleItemOff:\n${JSON.stringify(stateChange)}`);
        const entityRowSwap = stateChange.stateOrPart;
        const removeOnRow = new DeleteStateChange(entityRowSwap);
        const createOffRow = new CreateStateChange(entityRowSwap);
        return this._swappingRowSelectorOf(fp.defaultTo(SwitchType.OFF, entityRowSwap.context))
            .processStateChanges(removeOnRow, createOffRow);
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<StateChange[]>}
     */
    handleItemOn(stateChange) {
        console.log(`${this.constructor.name}.handleItemOn:\n${JSON.stringify(stateChange)}`);
        const entityRowSwap = stateChange.stateOrPart;
        stateChange = new CreateStateChange(entityRowSwap);
        return this._swappingRowSelectorOf(fp.defaultTo(SwitchType.ON, entityRowSwap.context))
            .processStateChanges(stateChange);
    }

    /**
     * @param {string} switchType
     * @return {IdentifiableRowComponent}
     * @protected
     */
    _swappingRowSelectorOf(switchType) {
        return this.swappingRowSelector[switchType];
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     *
     * @protected
     */
    _configureEvents() {
        super._configureEvents();
        this.simpleListView.$elem
            .on(this._appendNamespaceTo("dblclick"),
                `tr${this._ownerSelector}`, this, this.onSwitch);
    }
}