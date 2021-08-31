/**
 * see also https://jsdoc.app/tags-type.html
 */
class AbstractComponent {
    /**
     * @type {{skipOwnViewUpdates: boolean}}
     */
    runtimeConfig = {};
    /**
     * @type {StateHolder}
     */
    state;
    /**
     * @type {AbstractView}
     */
    view;
    /**
     * @type {StateChangesDispatcher}
     */
    stateChangesDispatcher;
    /**
     * @type {CompositeBehaviour}
     */
    compositeBehaviour;
    /**
     * @type {EntityExtractor}
     */
    entityExtractor;
    /**
     * capability of acting as a child
     *
     * @type {ChildishBehaviour}
     */
    childishBehaviour;
    /**
     * @type {Promise<StateChange[]>}
     */
    autoInitializationResult;
    /**
     * @type {boolean|undefined}
     */
    dontConfigEventsOnError;
    /**
     * @type {boolean|undefined}
     */
    dontAutoInitialize;
    /**
     * @type {boolean|undefined}
     */
    dontReloadFromState;
    /**
     * @type {boolean|undefined}
     */
    clearChildrenOnReset;
    /**
     * @type {boolean|undefined}
     */
    updateViewOnce;
    /**
     * @type {boolean|undefined}
     */
    skipOwnViewUpdates;
    /**
     * @type {string|undefined}
     */
    childProperty;
    /**
     * @type {string|jQuery<HTMLElement>|undefined}
     */
    elemIdOrJQuery;
    /**
     * @type {{}}
     */
    dataAttributes;
    /**
     * @type {{}}
     */
    config;

    /**
     * @param {{}} options could contain both behaviour and layout specifications
     */
    constructor(options) {
        this.dataAttributes = this.dataAttributesOf(options.view?.$elem, options.elemIdOrJQuery);
        this.config = this.aggregatedOptionsOf(options); // includes this.dataAttributes
        ObjectUtils.copyDeclaredProperties(this, this.config);
        this.state = this.state ?? new StateHolder();
        this.stateChangesDispatcher = this.stateChangesDispatcher ?? new StateChangesDispatcher(this);
        this.entityExtractor = this.entityExtractor ?? new DefaultEntityExtractor(this);
        this._setupCompositeBehaviour(options.childCompFactories);
        this._setupChildishBehaviour(options.parentComponent);
        this.dontAutoInitialize = this.dontAutoInitialize ?? !!this.childishBehaviour;
        this._handleAutoInitialization();
    }

    /**
     * @param {jQuery<HTMLElement>=} $viewElem
     * @param {string|jQuery<HTMLElement>=} elemIdOrJQuery
     * @return {{}}
     * @protected
     */
    dataAttributesOf($viewElem, elemIdOrJQuery) {
        return _.defaults({}, DomUtils.dataOf($viewElem), DomUtils.dataOf(elemIdOrJQuery));
    }

    /**
     * depends on this.dataAttributes
     *
     * @param {{}} options
     * @return {{}}
     * @private
     */
    aggregatedOptionsOf(options) {
        return _.defaults({}, {...options}, this.dataAttributes);
    }

    /**
     * @typedef {function(parentComp: AbstractComponent): AbstractComponent} childCompFactoryFn
     * @protected
     */
    _setupCompositeBehaviour(childCompFactories) {
        this.compositeBehaviour = this.compositeBehaviour ?? new CompositeBehaviour(this);
        if (childCompFactories) {
            this.compositeBehaviour.addChildComponentFactory(childCompFactories);
        }
    }

    /**
     * @protected
     */
    _setupChildishBehaviour(parentComponent) {
        if (!this.canConstructChildishBehaviour(parentComponent)) {
            console.log(`${this.constructor.name} no childish behaviour`);
            return;
        }
        this.childishBehaviour = this.childishBehaviour ?? new DefaultChildishBehaviour(parentComponent, {childProperty: this.childProperty})
        this.childishBehaviour.childComp = this;
    }

    /**
     * @param {AbstractComponent} parentComponent
     * @return {boolean}
     * @protected
     */
    canConstructChildishBehaviour(parentComponent) {
        return this.childishBehaviour != null || parentComponent != null;
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
        if (this.childishBehaviour) {
            this.childishBehaviour.updateParentStateFromKidView(parentState);
        }
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
     * @param {*} state
     * @param {boolean=} dontRecordStateEvents
     * @return {Promise<StateChange[]>}
     * @final
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
        return this._reloadState()
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
        this._configureEvents();
        return this.compositeBehaviour.init().then(() => stateChanges);
    }

    _handleInitErrors(err) {
        console.error(`${this.constructor.name}.init, dontConfigEventsOnError = ${this.dontConfigEventsOnError}, error:\n`, err);
        if (!this.dontConfigEventsOnError) {
            // jqXHR is missing finally, so, if we would need to _configureEvents
            // on errors too, we would have to use catch anyway
            this._configureEvents();
        }
        throw err;
    }

    /**
     * Reloading the state from somewhere (e.g. a repository).
     *
     * @return {Promise<*>} with the loaded state
     * @protected
     */
    _reloadState() {
        return Promise.resolve();
    }

    /**
     * @protected
     */
    _configureEvents() {
        // do nothing
    }

    /**
     * Assigns handlerName to change types.
     *
     * @param {string} handlerName
     * @param {string|number} changeType defaults to [handlerName]
     */
    setHandlerName(handlerName, ...changeType) {
        const changeTypes = changeType.length ? changeType : [handlerName];
        this.stateChangesDispatcher.stateChangeHandlers.setHandlerName(handlerName, ...changeTypes);
    }

    /**
     * @param {{}} config containing {handlerName: [changeTypes]}
     * @param {string} [partName]
     */
    configurePartChangeHandlers(config, partName) {
        this.stateChangesDispatcher.partChangeHandlers.configureHandlerName(config);
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
            this.setHandlerName("updateViewOnAny", ...enableForAllOrSpecificChangeTypes);
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
        if (this.view.$elem) {
            this.view.$elem.off();
        }
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
     * @param events {string,string[]}
     * @return {string|*}
     * @protected
     */
    _appendNamespaceTo(events) {
        if ($.isArray(events)) {
            return events.map(ev => this._appendNamespaceTo(ev)).join(" ");
        } else {
            return `${events}${this.eventsNamespace}`;
        }
    }

    /**
     * @param btnNames {string[]|string}
     * @param [dontUseOwner] {boolean}
     * @return {string} a selector e.g. [data-owner='personsTable'][data-btn='reload']
     * @protected
     */
    _btnSelector(btnNames, dontUseOwner) {
        if (!$.isArray(btnNames)) {
            btnNames = [btnNames];
        }
        return btnNames.map(name => `${this._ownerSelector}[data-btn='${name}']`).join();
    }

    /**
     * @param {AbstractComponent} parent
     * @param {AbstractComponent} clazz
     * @return {AbstractComponent[]}
     */
    findKidsByClass(clazz) {
        return this.compositeBehaviour.findKids((kid) => kid instanceof clazz);
    }

    /**
     * @returns {string}
     * @protected
     */
    get eventsNamespace() {
        return `.${this.constructor.name}.${this.view.owner}`;
    }

    /**
     * @returns {string}
     * @protected
     */
    get _ownerSelector() {
        return `[data-${JQueryWidgetsConfig.OWNER_ATTRIBUTE}='${this.view.owner}']`;
    }
}