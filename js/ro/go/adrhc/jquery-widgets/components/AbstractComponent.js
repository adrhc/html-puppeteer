/**
 * see also https://jsdoc.app/tags-type.html
 */
class AbstractComponent {
    /**
     * component's configuration
     *
     * @type {ComponentConfiguration}
     */
    config;
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
     * @type {ChildishBehaviour}
     */
    childishBehaviour;

    /**
     * @param {AbstractView} view
     * @param {StateHolder=} state
     * @param compositeBehaviour
     * @param childCompFactories
     * @param {ChildishBehaviour=} childishBehaviour
     * @param {AbstractComponent} parentComponent
     * @param {ComponentConfiguration=} config
     */
    constructor({
                    view,
                    state = new StateHolder(),
                    compositeBehaviour,
                    childCompFactories,
                    childishBehaviour,
                    parentComponent,
                    config = ComponentConfiguration.configOf(view?.$elem),
                }) {
        this.state = state;
        this.view = view;
        this.config = config;
        this.stateChangesDispatcher = new StateChangesDispatcher(this);
        this.entityExtractor = new DefaultEntityExtractor(this);
        this._setupCompositeBehaviour(compositeBehaviour, childCompFactories);
        this._setupChildishBehaviour({childishBehaviour, parentComponent});
        return this._handleAutoInitialization();
    }

    /**
     * @param {ChildishBehaviour=} childishBehaviour
     * @param {AbstractComponent} parentComponent
     * @param {string|number} childProperty
     * @protected
     */
    _setupChildishBehaviour({
                                childishBehaviour,
                                parentComponent,
                                childProperty = this.config.childProperty
                            }) {
        if (!childishBehaviour && !parentComponent) {
            console.log(`${this.constructor.name} no childish behaviour`);
            return;
        }
        childishBehaviour = childishBehaviour ?? new DefaultChildishBehaviour(parentComponent, {childProperty})
        childishBehaviour.childComp = this;
        this.childishBehaviour = childishBehaviour;
    }

    /**
     * @typedef {function(parentComp: AbstractComponent): AbstractComponent} childCompFactoryFn
     * @param {CompositeBehaviour} compositeBehaviour
     * @param {childCompFactoryFn|Array<childCompFactoryFn>|ChildComponentFactory|ChildComponentFactory[]} [childCompFactories]
     * @protected
     */
    _setupCompositeBehaviour(compositeBehaviour, childCompFactories) {
        this.compositeBehaviour = fp.defaultTo(new CompositeBehaviour(this), compositeBehaviour);
        if (childCompFactories) {
            this.compositeBehaviour.addChildComponentFactory(childCompFactories);
        }
    }

    /**
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _handleAutoInitialization(config = this.config) {
        if (!config.dontAutoInitialize) {
            return this.init();
        }
    }

    /**
     * see this as the "child component" capability of the current/this component
     *
     * @type {ChildishBehaviour}
     */
    _childishBehaviour;

    get childishBehaviour() {
        return this._childishBehaviour;
    }

    /**
     * @param childishBehaviour {ChildishBehaviour}
     */
    set childishBehaviour(childishBehaviour) {
        childishBehaviour.childComp = this;
        this._childishBehaviour = childishBehaviour;
    }

    /**
     * @returns {string}
     * @protected
     */
    get _eventsNamespace() {
        return `.${this.constructor.name}.${this.view.owner}`;
    }

    /**
     * @returns {string}
     * @protected
     */
    get _ownerSelector() {
        return `[data-${JQueryWidgetsConfig.OWNER_ATTRIBUTE}='${this.view.owner}']`;
    }

    /**
     * Copies child (me/this/own-only) state (if any) into the parentState
     * Ignores the children state (but check CompositeBehaviour.updateFromKidsView).
     * Overlaps with this.extract*Entity.
     *
     * @param parentState
     * @return {boolean}
     */
    updateParentFromOwnedView(parentState) {
        if (this._childishBehaviour) {
            this._childishBehaviour.updateParentFromChildView(parentState);
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
     * @param {*} stateOrPart
     * @param {string|number} [partName]
     * @param {boolean} [dontRecordStateEvents]
     * @return {Promise<StateChange[]>}
     * @final
     */
    update(stateOrPart, {partName, dontRecordStateEvents} = {}) {
        return this.doWithState((basicState) => {
            basicState.replace(stateOrPart, {partName, dontRecordStateEvents});
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
        console.log(`${this.constructor.name}.doWithState: delayViewUpdate = ${delayViewUpdate}`);
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
        this._safelyLogStateChange(stateChange, "updateViewOnAny");
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
                if (this.config.updateViewOnce) {
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
            .then(this._handleViewUpdateOnInit.bind(this))
            .then(this._handleEventsConfigurationOnInit.bind(this))
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
     * @param {StateChange[]} stateChanges
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _handleEventsConfigurationOnInit(stateChanges) {
        console.log(`${this.constructor.name}.init: compositeBehaviour.init`);
        this._configureEvents();
        return this.compositeBehaviour.init().then(() => stateChanges);
    }

    _handleInitErrors(err) {
        console.error(`${this.constructor.name}.init, dontConfigEventsOnError = ${this.config.dontConfigEventsOnError}, error:\n`, err);
        if (!this.config.dontConfigEventsOnError) {
            // jqXHR is missing finally, so, if we would need to _configureEvents
            // on errors too, we would have to use catch anyway
            this._configureEvents();
        }
        throw err;
    }

    /**
     * Reloading the state from somewhere (e.g. a repository).
     *
     * @return {Promise<*>} the loaded state
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
        this.compositeBehaviour.reset(this.config.clearChildrenOnReset);
        if (this.view.$elem) {
            this.view.$elem.off(this._eventsNamespace);
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
            return `${events}${this._eventsNamespace}`;
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
}