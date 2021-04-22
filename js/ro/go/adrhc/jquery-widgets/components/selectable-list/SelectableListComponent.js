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
     * @param {string|jQuery<HTMLTableElement>} elemIdOrJQuery
     * @param {string=} bodyRowTmplId could be empty when not using a row template (but only the table)
     * @param {string=} bodyRowTmplHtml
     * @param {string=} bodyTmplHtml
     * @param {string=} rowDataId
     * @param {string} rowPositionOnCreate
     * @param {string=} childProperty
     * @param {boolean=} dontAutoInitialize
     * @param {SimpleListConfiguration=} config
     * @param {IdentifiableEntity[]=} items
     * @param {CrudRepository=} repository
     * @param {MustacheTableElemAdapter=} mustacheTableElemAdapter
     * @param {function(): IdentifiableEntity} newEntityFactoryFn
     * @param {SimpleListState=} state
     * @param {IdentifiableRowComponent} offRow
     * @param {IdentifiableRowComponent} onRow
     * @param {SimpleListView=} view
     * @param {CompositeBehaviour=} compositeBehaviour
     * @param {childCompFactoryFn|childCompFactoryFn[]|ChildComponentFactory|ChildComponentFactory[]} [childCompFactories]
     * @param {ChildishBehaviour=} childishBehaviour permit CreateDeleteListComponent to update its parent
     * @param {AbstractComponent=} parentComponent
     */
    constructor({
                    elemIdOrJQuery,
                    bodyRowTmplId,
                    bodyRowTmplHtml,
                    bodyTmplHtml,
                    rowDataId,
                    rowPositionOnCreate,
                    childProperty,
                    dontAutoInitialize,
                    childishBehaviour,
                    parentComponent,
                    config = SimpleListConfiguration.configOf(elemIdOrJQuery, {
                        dontAutoInitialize: AbstractComponent._canConstructChildishBehaviour(childishBehaviour, parentComponent)
                    }).overwriteWith({
                        bodyRowTmplId,
                        bodyRowTmplHtml,
                        bodyTmplHtml,
                        rowDataId,
                        rowPositionOnCreate,
                        childProperty,
                        dontAutoInitialize
                    }),
                    items = typeof config.items === "string" ? JSON.parse(config.items) : config.items ?? [],
                    repository = new InMemoryCrudRepository(items),
                    mustacheTableElemAdapter = new MustacheTableElemAdapter(elemIdOrJQuery, config),
                    newEntityFactoryFn,
                    state = new SelectableListState({
                        newEntityFactoryFn,
                        newItemsGoLast: mustacheTableElemAdapter.rowPositionOnCreate === "append"
                    }),
                    offRow = SelectableListComponent.$offRowTmpl(elemIdOrJQuery, mustacheTableElemAdapter, config),
                    onRow = SelectableListComponent.$onRowTmpl(elemIdOrJQuery, mustacheTableElemAdapter, config),
                    view = new SimpleListView(mustacheTableElemAdapter),
                    compositeBehaviour,
                    childCompFactories
                }) {
        super({
            repository,
            view,
            state,
            compositeBehaviour,
            childCompFactories,
            childishBehaviour,
            parentComponent,
            config: config.dontAutoInitializeOf()
        });
        this.config = config;
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
        return this._handleAutoInitialization();
    }

    static $offRowTmpl(elemIdOrJQuery, mustacheTableElemAdapter, config) {
        return SelectableListComponent._$rowTmplOf(elemIdOrJQuery, mustacheTableElemAdapter, config, SelectableListComponent.OFF_ROW_TYPE);
    }

    static $onRowTmpl(elemIdOrJQuery, mustacheTableElemAdapter, config) {
        return SelectableListComponent._$rowTmplOf(elemIdOrJQuery, mustacheTableElemAdapter, config, SelectableListComponent.ON_ROW_TYPE);
    }

    static _$rowTmplOf(elemIdOrJQuery, mustacheTableElemAdapter, tableConfig, type) {
        let $rowTmplElem = mustacheTableElemAdapter.$rowByData(SelectableListComponent.ROW_TYPE_DATA_NAME, type);
        const index = type === SelectableListComponent.OFF_ROW_TYPE ? 1 : 2;
        $rowTmplElem = $rowTmplElem ?? mustacheTableElemAdapter.$rowByIndex(index);
        if (!$rowTmplElem) {
            return undefined;
        }
        const bodyRowTmplHtml = DomUtils.htmlIncludingSelfOf($rowTmplElem);
        const config = RowConfiguration.configOf($rowTmplElem, tableConfig.overwriteWith({bodyRowTmplHtml}));
        return new IdentifiableRowComponent({
            elemIdOrJQuery,
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
        const entityRowSwap = stateChange.stateOrPart;
        const removeOnRow = new DeleteStateChange(entityRowSwap);
        const createOffRow = new CreateStateChange(entityRowSwap);
        return this._swappingRowSelectorOf(entityRowSwap.context ?? SwitchType.OFF)
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
        return this._swappingRowSelectorOf(entityRowSwap.context ?? SwitchType.ON)
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