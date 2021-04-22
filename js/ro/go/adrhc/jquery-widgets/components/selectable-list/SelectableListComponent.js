/**
 * todo: should I reset the swappingState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL and offRow is not automatically creating the related row,
 * than the next onSwitch will determine swappingState to render as "deselected" the previous
 * item but only if already exists (in table) otherwise nothing will be rendered for it.
 */
class SelectableListComponent extends SimpleListComponent {
    static OFF_ROW_TYPE = "off";
    static ON_ROW_TYPE = "on";
    static ROW_TYPE_DATA_NAME = "data-row-type";
    /**
     * @type {Object}
     */
    swappingRowSelector;

    /**
     * @param {SelectableListOptions=} options
     */
    constructor(options = new SelectableListOptions()) {
        super(SelectableListComponent._optionsWithDefaults(options, true));
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
     * @param {boolean=} forceDontAutoInitialize
     * @return {SelectableListOptions}
     * @protected
     */
    static _optionsWithDefaults(options, forceDontAutoInitialize = options.forceDontAutoInitialize) {
        const selectableListOptions = _.defaults(new SelectableListOptions(),
            SimpleListComponent._optionsWithDefaults(options, forceDontAutoInitialize));
        selectableListOptions.state = options.state ?? SelectableListComponent._selectableListStateOf(selectableListOptions);
        return selectableListOptions;
    }

    /**
     * @param {SelectableListOptions} selectableListOptions
     * @return {SelectableListState}
     * @protected
     */
    static _selectableListStateOf(selectableListOptions) {
        return new SelectableListState({
            newEntityFactoryFn: selectableListOptions.newEntityFactoryFn,
            newItemsGoLast: selectableListOptions.rowPositionOnCreate === "append"
        })
    }

    /**
     * @param {SelectableListOptions} options
     * @protected
     */
    _createSwappingRowSelector(options) {
        const mustacheTableElemAdapter = this.simpleListView.mustacheTableElemAdapter;
        return {
            [SwitchType.OFF]: options.offRow ?? SelectableListComponent.$offRowTmpl(mustacheTableElemAdapter, this.config),
            [SwitchType.ON]: options.onRow ?? SelectableListComponent.$onRowTmpl(mustacheTableElemAdapter, this.config)
        };
    }

    static $offRowTmpl(mustacheTableElemAdapter, config) {
        return SelectableListComponent._$rowTmplOf(
            SelectableListComponent.OFF_ROW_TYPE, mustacheTableElemAdapter, config);
    }

    static $onRowTmpl(mustacheTableElemAdapter, config) {
        return SelectableListComponent._$rowTmplOf(
            SelectableListComponent.ON_ROW_TYPE, mustacheTableElemAdapter, config);
    }

    static _$rowTmplOf(type, mustacheTableElemAdapter, tableConfig) {
        let $rowTmplElem = mustacheTableElemAdapter.$rowByData(SelectableListComponent.ROW_TYPE_DATA_NAME, type);
        const index = type === SelectableListComponent.OFF_ROW_TYPE ? 1 : 2;
        $rowTmplElem = $rowTmplElem ?? mustacheTableElemAdapter.$rowByIndex(index);
        if (!$rowTmplElem) {
            return undefined;
        }
        const bodyRowTmplHtml = DomUtils.htmlIncludingSelfOf($rowTmplElem);
        const config = RowConfiguration.configOf($rowTmplElem, tableConfig.overwriteWith({bodyRowTmplHtml}));
        return new IdentifiableRowComponent({
            elemIdOrJQuery: tableConfig.elemIdOrJQuery,
            config
        });
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
        return this.offRow.processStateChanges(new CreateStateChange(stateChange.stateOrPart));
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<StateChange[]>}
     */
    handleItemOn(stateChange) {
        console.log(`${this.constructor.name}.handleItemOn:\n${JSON.stringify(stateChange)}`);
        const context = stateChange.stateOrPart.context ?? SwitchType.ON;
        const rowComp = this._swappingRowSelectorOf(context);
        return rowComp.processStateChanges(new CreateStateChange(stateChange.stateOrPart));
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