/**
 * todo: should I reset the swappingState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL and offRow is not automatically creating the related row,
 * than the next onSwitch will determine swappingState to render as "deselected" the previous
 * item but only if already exists (in table) otherwise nothing will be rendered for it.
 */
class SelectableListComponent extends SimpleListComponent {
    static ROW_TYPE_DATA_NAME = "data-row-type";
    static OFF_ROW_TYPE = "off";
    static ON_ROW_TYPE = "on";
    static ROW_TEMPLATE_INDEXES = {
        "off": 1,
        "on": 2,
    }

    /**
     * @type {Object}
     */
    swappingRowSelector;

    /**
     * @param {SelectableListOptions=} options
     */
    constructor(options = new SelectableListOptions()) {
        super(SelectableListOptions.of(options, true));
        this.configurePartChangeHandlers({
            handleItemChange: ["CREATE", "REPLACE", "DELETE"],
            handleItemOff: ["OFF"],
            handleItemOn: ["ON"]
        }, "Item");
        this.entityExtractor = new SelectableListEntityExtractor(this);
        this.swappingRowSelector = this._createSwappingRowSelector(options);
        return this._handleAutoInitialization();
    }

    /**
     * @param {SelectableListOptions} options
     * @return {{}}
     * @protected
     */
    _createSwappingRowSelector(options) {
        return {
            [SwitchType.OFF]: options.offRow ?? this._createOffRow(),
            [SwitchType.ON]: options.onRow ?? this._createOnRow()
        };
    }

    _createOffRow() {
        return this._identifiableRowComponentForType(SelectableListComponent.OFF_ROW_TYPE);
    }

    _createOnRow() {
        return this._identifiableRowComponentForType(SelectableListComponent.ON_ROW_TYPE);
    }

    /**
     * @param {string} type
     * @return {IdentifiableRowComponent|undefined}
     * @protected
     */
    _identifiableRowComponentForType(type) {
        const $rowTmplElem = this._$rowTemplateOf(type);
        return $rowTmplElem ? this._identifiableRowComponentFromRowElem($rowTmplElem) : undefined;
    }

    /**
     * @param {jQuery<HTMLTableRowElement>} $rowTmplElem
     * @return {IdentifiableRowComponent}
     * @protected
     */
    _identifiableRowComponentFromRowElem($rowTmplElem) {
        const bodyRowTmplHtml = DomUtils.htmlIncludingSelfOf($rowTmplElem);
        const config = RowConfiguration.of(this.config.elemIdOrJQuery, {bodyRowTmplHtml});
        return new IdentifiableRowComponent({
            elemIdOrJQuery: this.config.elemIdOrJQuery,
            config
        });
    }

    /**
     * @param {string} type
     * @return {jQuery<HTMLTableRowElement>}
     * @protected
     */
    _$rowTemplateOf(type) {
        const mustacheTableElemAdapter = this.simpleListView.mustacheTableElemAdapter;
        const $rowTmplElem = mustacheTableElemAdapter.$rowByData(SelectableListComponent.ROW_TYPE_DATA_NAME, type);
        const rowTemplateIndex = this._rowTemplateIndexOf(type);
        return $rowTmplElem ?? mustacheTableElemAdapter.$rowByIndex(rowTemplateIndex);
    }

    /**
     * @param {string} type
     * @return {number}
     * @protected
     */
    _rowTemplateIndexOf(type) {
        return SelectableListComponent.ROW_TEMPLATE_INDEXES[type];
    }

    /**
     * (existing) item selection event handler
     *
     * @param ev {Event}
     */
    onSwitch(ev) {
        const selectableList = ev.data;
        if (selectableList.shouldIgnoreOnSwitch(ev)) {
            return;
        }
        ev.stopPropagation();
        const rowDataId = selectableList.simpleListView.rowDataIdOf(this);
        selectableList.switchTo(rowDataId);
    }

    shouldIgnoreOnSwitch(ev) {
        return !$(ev.currentTarget).is("tr,td,th");
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
     * @param {TaggedStateChange<EntityRow>} stateChange
     * @return {Promise<TaggedStateChange<EntityRow>[]>}
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
        return this.offRow.processStateChanges(
            new CreateStateChange(stateChange.stateOrPart, stateChange.partName));
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<StateChange[]>}
     */
    handleItemOn(stateChange) {
        console.log(`${this.constructor.name}.handleItemOn:\n${JSON.stringify(stateChange)}`);
        const context = stateChange.stateOrPart.context ?? SwitchType.ON;
        const rowComp = this.swappingRowSelector[context];
        return rowComp.processStateChanges(
            new CreateStateChange(stateChange.stateOrPart, stateChange.partName));
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
        const context = entityRowSwap.context ?? SwitchType.ON;
        return this.swappingRowSelector[context];
    }

    /**
     * @return {SimpleListView}
     */
    get simpleListView() {
        return this.view;
    }

    /**
     * @return {SelectableListState}
     */
    get selectableListState() {
        return this.state;
    }

    /**
     * @return {SelectableListEntityExtractor}
     */
    get selectableListEntityExtractor() {
        return this.entityExtractor;
    }

    get offRow() {
        return this.swappingRowSelector[SwitchType.OFF];
    }
}