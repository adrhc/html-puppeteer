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
     * @param {ChildishBehaviour=} childishBehaviour
     * @param {ComponentConfiguration=} config
     */
    constructor({
                    view,
                    state = new StateHolder({}),
                    childishBehaviour,
                    config = ComponentConfiguration.configOf(view?.$elem),
                }) {
        this.state = state;
        this.view = view;
        this.config = config;
        this.stateChangesDispatcher = new StateChangesDispatcher(this);
        this.compositeBehaviour = new CompositeBehaviour(this);
        this.entityExtractor = new DefaultEntityExtractor(this, {});
        if (childishBehaviour) {
            this.childishBehaviour = childishBehaviour;
        } else if (config.childProperty) {
            this.childishBehaviour = new DefaultChildishBehaviour(this, {childProperty: config.childProperty});
        }
        if (!config.dontAutoInitialize) {
            return this.init().then(() => this);
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
        return `[data-owner='${this.view.owner}']`;
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
     */
    update(stateOrPart, {partName, dontRecordStateEvents} = {}) {
        return this.doWithState((basicState) => {
            basicState.replace(stateOrPart, {partName, dontRecordStateEvents})
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
     * @return {Promise<StateChange[]>}
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
        if (!this.stateChangesDispatcher.stateChangeHandlers
            .isHandlerOf("updateViewOnAny", stateChange.changeType)) {
            console.log(`${this.constructor.name}.updateViewOnAny skipped!`);
            return Promise.reject(stateChange);
        }
        if (this.runtimeConfig.skipOwnViewUpdates) {
            return this.compositeBehaviour.processStateChangeWithKids(stateChange);
        }
        return this.view.update(stateChange)
            .then(() => {
                if (this.config.updateViewOnce) {
                    this.runtimeConfig.skipOwnViewUpdates = true
                }
            })
            .then(() => this.compositeBehaviour.processStateChangeWithKids(stateChange));
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

    updateViewOnERROR(stateChange) {
        console.log(`${this.constructor.name}.updateViewOnERROR:\n${JSON.stringify(stateChange)}`);
        return Promise.resolve(stateChange);
    }

    /**
     * component initializer: (re)load state, update the view, configure events then init kids
     *
     * @return {Promise<StateChange[]>}
     */
    init() {
        return this._reloadState()
            .then(() => {
                console.log(`${this.constructor.name}.init: updateViewOnStateChanges`);
                AssertionUtils.isNullOrEmpty(this.compositeBehaviour.childComponents,
                    `${this.constructor.name}.init: childComponents should be empty!`);
                return this.updateViewOnStateChanges();
            })
            .then((stateChanges) => {
                console.log(`${this.constructor.name}.init: compositeBehaviour.init`);
                this._configureEvents();
                return this.compositeBehaviour.init().then(() => stateChanges);
            })
            .catch((err) => {
                console.error(`${this.constructor.name}.init, dontConfigEventsOnError = ${this.config.dontConfigEventsOnError}, error:\n`, err);
                if (!this.config.dontConfigEventsOnError) {
                    // jqXHR is missing finally, so, if we would need to _configureEvents
                    // on errors too, we would have to use catch anyway
                    this._configureEvents();
                }
                throw err;
            });
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
     * @param {string|number} changeType
     */
    setHandlerName(handlerName, ...changeType) {
        this.stateChangesDispatcher.stateChangeHandlers.setHandlerName(handlerName, ...changeType);
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
     * @param {boolean|string[]=} enableForAllChanges whether to handle or not with updateViewOnAny or a change type array
     */
    handleWithAny(enableForAllChanges = true) {
        if (typeof enableForAllChanges === "boolean") {
            this.setHandlerName("updateViewOnAny", enableForAllChanges ? StateChangeHandlersManager.ANY : undefined);
        } else {
            this.setHandlerName("updateViewOnAny", ...enableForAllChanges);
        }
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