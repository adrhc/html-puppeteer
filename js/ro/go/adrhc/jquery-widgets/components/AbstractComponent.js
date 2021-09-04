/**
 * see also https://jsdoc.app/tags-type.html
 */
class AbstractComponent {
    /**
     * @type {Promise<StateChange[]>}
     */
    autoInitializationResult;
    /**
     * @type {string|undefined}
     */
    childProperty;
    /**
     * capability of acting as a child
     *
     * @type {ChildishBehaviour}
     */
    childishBehaviour;
    /**
     * @type {boolean|undefined}
     */
    clearChildrenOnReset;
    /**
     * @type {CompositeBehaviour}
     */
    compositeBehaviour;
    /**
     * @type {{}}
     */
    dataAttributes;
    /**
     * @type {{}}
     */
    defaults;
    /**
     * @type {boolean|undefined}
     */
    dontAutoInitialize;
    /**
     * @type {boolean|undefined}
     */
    dontConfigEventsOnError;
    /**
     * @type {boolean|undefined}
     */
    dontReloadFromState;
    /**
     * @type {string|jQuery<HTMLElement>|undefined}
     */
    elemIdOrJQuery;
    /**
     * @type {EntityExtractor}
     */
    entityExtractor;
    /**
     * @type {EventsBinderConfigurer}
     */
    eventsBinderConfigurer;
    /**
     * is the parent component of this component
     *
     * @type {AbstractComponent}
     */
    parentComponent;
    /**
     * @type {{skipOwnViewUpdates: boolean}}
     */
    runtimeConfig = {};
    /**
     * @type {boolean|undefined}
     */
    skipOwnViewUpdates;
    /**
     * @type {StateHolder}
     */
    state;
    /**
     * @type {StateChangesDispatcher}
     */
    stateChangesDispatcher;
    /**
     * @type {boolean|undefined}
     */
    updateViewOnce;
    /**
     * @type {AbstractView}
     */
    view;

    /**
     * @param {{}} options could contain both behaviour and layout specifications
     */
    constructor(options) {
        this.dataAttributes = this.dataAttributesOf(options.view?.$elem, options.elemIdOrJQuery);
        this.defaults = this.defaultsOf(options); // includes this.dataAttributes
        Object.assign(this, this.defaults);
        this.state = this.state ?? this._createStateHolder();
        this.view = this.view ?? this._createView();
        this.eventsBinderConfigurer = this.eventsBinderConfigurer ?? this._createEventsBinderConfigurer();
        this.stateChangesDispatcher = this.stateChangesDispatcher ?? this._createStateChangesDispatcher();
        this.entityExtractor = this.entityExtractor ?? this._createEntityExtractor();
        this._setupChildishBehaviour();
        this._setupCompositeBehaviour();
        this.dontAutoInitialize = this._dontAutoInitializeOf(options);
        this._handleAutoInitialization();
    }

    /**
     * @return {EventsBinderConfigurer}
     * @protected
     */
    _createEventsBinderConfigurer() {
        // do nothing;
    }

    /**
     * @return {AbstractView}
     * @protected
     */
    _createView() {
        return undefined;
    }

    /**
     * @return {StateHolder}
     * @protected
     */
    _createStateHolder() {
        return new StateHolder(this.defaults);
    }

    /**
     * @return {StateChangesDispatcher}
     * @protected
     */
    _createStateChangesDispatcher() {
        return new StateChangesDispatcher(this);
    }

    /**
     * @return {EntityExtractor}
     * @protected
     */
    _createEntityExtractor() {
        return new DefaultEntityExtractor(this, this.defaults);
    }

    /**
     * @param {{dontAutoInitialize?: boolean|undefined}=} options
     * @return {boolean|undefined}
     * @protected
     */
    _dontAutoInitializeOf({dontAutoInitialize} = {}) {
        return dontAutoInitialize ?? this.dataAttributes.dontAutoInitialize ?? !!this.childishBehaviour;
    }

    /**
     * @param {jQuery<HTMLElement>=} $viewElem
     * @param {string|jQuery<HTMLElement>=} elemIdOrJQuery
     * @return {{}}
     * @protected
     */
    dataAttributesOf($viewElem, elemIdOrJQuery) {
        return Object.assign({}, DomUtils.dataOf(elemIdOrJQuery), DomUtils.dataOf($viewElem));
    }

    /**
     * depends on this.dataAttributes
     *
     * @param {{}} options
     * @return {{}}
     * @private
     */
    defaultsOf(options) {
        return Object.assign({}, this.dataAttributes, {...options});
    }

    /**
     * @protected
     */
    _setupCompositeBehaviour() {
        this.compositeBehaviour = this.compositeBehaviour ?? this._createCompositeBehaviour();
        if (this.defaults.childCompFactories) {
            this.compositeBehaviour.addChildComponentFactory(this.defaults.childCompFactories);
        }
    }

    /**
     * @protected
     */
    _setupChildishBehaviour() {
        if (!this.canConstructChildishBehaviour()) {
            console.log(`${this.constructor.name} no childish behaviour`);
            return;
        }
        this.childishBehaviour = this.childishBehaviour ?? this._createChildishBehaviour()
        this.childishBehaviour.childComp = this;
    }

    /**
     * @return {ChildishBehaviour}
     * @protected
     */
    _createChildishBehaviour() {
        return new DefaultChildishBehaviour(this.parentComponent, this.defaults);
    }

    /**
     * @return {CompositeBehaviour}
     * @protected
     */
    _createCompositeBehaviour() {
        return new CompositeBehaviour(this);
    }

    /**
     * @param {AbstractComponent} parentComponent
     * @return {boolean}
     * @protected
     */
    canConstructChildishBehaviour() {
        return this.childishBehaviour != null || this.parentComponent != null;
    }

    /**
     * @protected
     */
    _handleAutoInitialization() {
        if (!this.dontAutoInitialize) {
            this.autoInitializationResult = this.init();
        }
    }

    /**
     * Copies child (me/this/own-only) state (if any) into the parentState
     * Ignores the children state (but check CompositeBehaviour.updateFromKidsView).
     * Overlaps with this.extract*Entity.
     *
     * @param parentState
     * @return {boolean}
     */
    updateStateFromKidsViews(parentState) {
        this.childishBehaviour?.updateParentStateFromKidView(parentState);
    }

    /**
     * @param [useOwnerOnFields] {boolean}
     * @return {IdentifiableEntity} the entity managed by the component when managing only 1 entity
     */
    extractEntity(useOwnerOnFields) {
        return this.entityExtractor.extractEntity(useOwnerOnFields)
    }

    /**
     * @param [useOwnerOnFields] {boolean}
     * @return {IdentifiableEntity[]} the entities managed by the component (could be only 1 entity)
     */
    extractAllEntities(useOwnerOnFields) {
        return this.entityExtractor.extractAllEntities(useOwnerOnFields)
    }

    /**
     * @param {*=} state
     * @param {boolean=} dontRecordStateEvents
     * @return {Promise<StateChange[]>}
     */
    update(state, dontRecordStateEvents) {
        return this.doWithState((basicState) => {
            basicState.replace(state, dontRecordStateEvents);
        });
    }

    /**
     * @param {StateChange} oldStateChange
     * @return {Promise<StateChange[]>}
     */
    processStateChanges(...oldStateChange) {
        return this.doWithState((basicState) => {
            // collecting again the old state change event
            oldStateChange.forEach(sc => basicState.collectStateChange(sc));
        });
    }

    /**
     * Offers the state for manipulation then updates the view.
     *
     * @param stateUpdaterFn {function(state: StateHolder)}
     * @param delayViewUpdate {boolean} whether to (immediately) update the view based or not
     * @return {Promise<StateChange[]>}
     */
    doWithState(stateUpdaterFn, delayViewUpdate = false) {
        // console.log(`[${this.constructor.name}.doWithState] delayViewUpdate = ${delayViewUpdate}`);
        stateUpdaterFn(this.state);
        if (delayViewUpdate) {
            return Promise.resolve(this.state.stateChanges.peekAll());
        }
        return this.updateViewOnStateChanges();
    }

    /**
     * @param [stateChanges] {StateChange[]}
     * @param [applyChangesStartingFromNewest] {boolean}
     * @return {Promise<StateChange>|Promise<StateChange>[]}
     */
    updateViewOnStateChanges(stateChanges, applyChangesStartingFromNewest) {
        return this.stateChangesDispatcher.updateViewOnStateChanges(stateChanges, applyChangesStartingFromNewest);
    }

    /**
     * @param {TaggedStateChange} stateChange
     * @return {Promise}
     */
    updateViewOnAny(stateChange) {
        // this._safelyLogStateChange(stateChange, "updateViewOnAny");
        if (!this.isAllowedToHandleWithAny(stateChange.changeType)) {
            console.log(`${this.constructor.name}.updateViewOnAny skipped!`);
            return Promise.reject(stateChange);
        }
        if (this.runtimeConfig.skipOwnViewUpdates) {
            return this.compositeBehaviour.processStateChangeWithKids(stateChange);
        }
        return this.view
            .update(stateChange)
            .then(() => {
                if (this.updateViewOnce) {
                    this.runtimeConfig.skipOwnViewUpdates = true;
                }
                return this.compositeBehaviour.processStateChangeWithKids(stateChange);
            });
    }

    /**
     * @param {StateChange} stateChange
     * @param {string} methodToLogFor
     * @protected
     */
    _safelyLogStateChange(stateChange, methodToLogFor = "_safelyLogStateChange") {
        try {
            console.log(`${this.constructor.name}.${methodToLogFor}, stateChange:\n${JSON.stringify(stateChange, null, 2)}`);
        } catch (e) {
            console.error(e);
            console.error(`${this.constructor.name}.${methodToLogFor}, stateChange:\n`, stateChange);
        }
    }

    /**
     * component initializer: (re)load state, update the view, configure events then init kids
     *
     * @return {Promise<StateChange[]>}
     */
    init() {
        return this._initializeState()
            // https://stackoverflow.com/questions/34930771/why-is-this-undefined-inside-class-method-when-using-promises?answertab=active#tab-top
            .then(this._handleViewUpdateOnInit.bind(this))
            .then(this._configureEventsAndInitKidsOnInit.bind(this))
            .catch(this._handleInitErrors.bind(this));
    }

    /**
     * @param {*} loadedState
     * @return {Promise<StateChange>|Promise<StateChange>[]}
     * @protected
     */
    _handleViewUpdateOnInit(loadedState) {
        console.log(`${this.constructor.name}.init: updateViewOnStateChanges`);
        AssertionUtils.isNullOrEmpty(this.compositeBehaviour.childComponents,
            `${this.constructor.name}.init: childComponents should be empty!`);
        return this.updateViewOnStateChanges();
    }

    /**
     * @param {StateChange|StateChange[]} stateChanges
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _configureEventsAndInitKidsOnInit(stateChanges) {
        console.log(`${this.constructor.name}.init: compositeBehaviour.init`);
        this.eventsBinderConfigurer?.attachEventHandlers();
        return this.compositeBehaviour.init().then(() => stateChanges);
    }

    _handleInitErrors(err) {
        console.error(`${this.constructor.name}.init, dontConfigEventsOnError = ${this.dontConfigEventsOnError}, error:\n`, err);
        if (!this.dontConfigEventsOnError) {
            // jqXHR is missing finally, so, if we would need to _configureEvents
            // on errors too, we would have to use catch anyway
            this.eventsBinderConfigurer?.attachEventHandlers();
        }
        throw err;
    }

    /**
     * Reloading the state from somewhere (e.g. a repository).
     *
     * @return {Promise<*>} with the loaded state
     * @protected
     */
    _initializeState() {
        return Promise.resolve();
    }

    /**
     * Assigns handlerName to change types.
     *
     * @param {string} handlerName
     * @param {string|number|string[]|number[]} changeTypes
     */
    setHandlerName(handlerName, changeTypes) {
        changeTypes = changeTypes.length ? changeTypes : [changeTypes];
        this.stateChangesDispatcher.stateChangeHandlers.setHandlerName(handlerName, changeTypes);
    }

    /**
     * @param {{}} options containing {handlerName: [changeTypes]}
     * @param {string} [partName]
     */
    configurePartChangeHandlers(options, partName) {
        this.stateChangesDispatcher.partChangeHandlers.configureHandlerName(options);
        if (partName != null) {
            this.stateChangesDispatcher.usePartName(partName);
        }
    }

    /**
     * @param {boolean|string[]=} enableForAllOrSpecificChangeTypes whether to use or not updateViewOnAny (for everything or for a specific change-type array)
     */
    handleWithAny(enableForAllOrSpecificChangeTypes = true) {
        if (typeof enableForAllOrSpecificChangeTypes === "boolean") {
            this.setHandlerName("updateViewOnAny", enableForAllOrSpecificChangeTypes ? StateChangeHandlersManager.ALL_CHANGE_TYPES : undefined);
        } else {
            this.setHandlerName("updateViewOnAny", enableForAllOrSpecificChangeTypes);
        }
    }

    /**
     * @param {string} changeType
     * @return {boolean}
     */
    isAllowedToHandleWithAny(changeType) {
        return this.stateChangesDispatcher.stateChangeHandlers
            .shouldHandleWith("updateViewOnAny", changeType);
    }

    /**
     * brings the component to the state existing at its creation
     */
    reset() {
        this.compositeBehaviour.reset(this.clearChildrenOnReset);
        this.view.$elem?.off();
        this.view.reset();
        this.state.reset();
    }

    /**
     * (internal) errors handler
     *
     * @param promise {Promise}
     * @return {Promise}
     * @protected
     */
    _handleRepoErrors(promise) {
        return promise.catch((jqXHR, textStatus) => {
            console.error(`${this.constructor.name}._handleRepoErrors`);
            if (typeof jqXHR === "string") {
                alert(jqXHR);
                throw jqXHR;
            } else if (jqXHR instanceof SimpleError) {
                alert(jqXHR.message);
                throw jqXHR;
            } else {
                alert(`textStatus = ${textStatus}${jqXHR.responseText ? ', responseText:\n' + jqXHR.responseText : ''}`);
                throw textStatus;
            }
        });
    }

    /**
     * @param {AbstractComponent} parent
     * @param {AbstractComponent} clazz
     * @return {AbstractComponent[]}
     */
    findKidsByClass(clazz) {
        return this.compositeBehaviour.findKids((kid) => kid instanceof clazz);
    }
}