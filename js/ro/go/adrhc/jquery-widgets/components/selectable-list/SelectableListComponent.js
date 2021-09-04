/**
 * todo: should I reset the swappingState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL and offRow is not automatically creating the related row,
 * than the next onSwitch will determine swappingState to render as "deselected" the previous
 * item but only if already exists (in table) otherwise nothing will be rendered for it.
 */
class SelectableListComponent extends SimpleListComponent {
    static OFF_ROW_TYPE = "off";
    static ON_ROW_TYPE = "on";
    static ROW_TEMPLATE_INDEXES = {
        "off": 1,
        "on": 2,
    }
    static ROW_TYPE_DATA_NAME = "data-row-type";
    /**
     * @type {Object}
     */
    swappingRowSelector;

    get offRow() {
        return this.swappingRowSelector[SwitchType.OFF];
    }

    /**
     * @return {SelectableListState}
     */
    get selectableListState() {
        return this.state;
    }

    /**
     * @return {SimpleListView}
     */
    get simpleListView() {
        return this.view;
    }

    /**
     * @return {SelectableListComponent|Promise<SelectableListComponent>}
     */
    constructor({state, config: {dontAutoInitialize, ...restOfConfig}, ...options}) {
        super(SelectableListOptions.of({...options, config: {dontAutoInitialize: true, ...restOfConfig}}));
        this.configurePartChangeHandlers({
            handleItemChange: ["CREATE", "REPLACE", "DELETE"],
            handleItemOff: ["OFF"],
            handleItemOn: ["ON"]
        }, "Item");
        this.state = state ?? new SelectableListState(this);
        this.entityExtractor = new SelectableListEntityExtractor(this);
        this.swappingRowSelector = this._createSwappingRowSelector(options);
        this.config.dontAutoInitialize = dontAutoInitialize ?? this.config.dontAutoInitialize;
        this._handleAutoInitialization();
    }

    _createEventsBinderConfigurer() {
        return new SelectableListEventsBinder(this);
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
        const config = new RowConfiguration({elemIdOrJQuery: this.config.elemIdOrJQuery, bodyRowTmplHtml});
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
            new CreateStateChange(stateChange.newStateOrPart, stateChange.partName));
    }

    /**
     * @param {TaggedStateChange<EntityRowSwap>} stateChange
     * @return {Promise<StateChange[]>}
     */
    handleItemOn(stateChange) {
        console.log(`${this.constructor.name}.handleItemOn:\n${JSON.stringify(stateChange)}`);
        const context = stateChange.newStateOrPart.context ?? SwitchType.ON;
        const rowComp = this.swappingRowSelector[context];
        return rowComp.processStateChanges(
            new CreateStateChange(stateChange.newStateOrPart, stateChange.partName));
    }
}