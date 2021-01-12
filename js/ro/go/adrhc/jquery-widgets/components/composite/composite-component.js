/**
 * this encapsulates the "component composition" capability of a component
 */
class CompositeComponent {
    /**
     * @type {AbstractComponent}
     */
    parentComp;
    /**
     * @type {ChildComponentFactory[]}
     */
    childComponentFactories = [];
    /**
     * @type {AbstractComponent[]}
     */
    childComponents = [];

    /**
     * @param parentComp {AbstractComponent}
     */
    constructor(parentComp) {
        this.parentComp = parentComp;
    }

    /**
     * @param childCompFactory {ChildComponentFactory|ChildComponentFactory[]}
     */
    addChildComponentFactory(childCompFactory) {
        if ($.isArray(childCompFactory)) {
            childCompFactory.forEach(it => this.childComponentFactories.push(it));
        } else {
            this.childComponentFactories.push(childCompFactory);
        }
    }

    /**
     * @param childComp {AbstractComponent|AbstractComponent[]}
     */
    addChildComponent(childComp) {
        if ($.isArray(childComp)) {
            childComp.forEach(it => this.childComponents.push(it));
        } else {
            this.childComponents.push(childComp);
        }
    }

    /**
     * @param parentState
     * @return {boolean} whether an update occured or not
     */
    copyKidsState(parentState) {
        const result = {};
        this.childComponents.forEach(kid => {
            result.existsChange = result.existsChange || kid.copyMyState(parentState);
        });
        return result.existsChange;
    }

    /**
     * @return {boolean} whether has component specifications or not
     */
    hasKids() {
        return this.childComponents.length > 0;
    }

    /**
     * @param stateChange {StateChange}
     * @param kidsFilter {function(comp: AbstractComponent): boolean}
     * @param removeAfterProcessing {boolean}
     * @return {Promise<StateChange[][]>}
     */
    process(stateChange, kidsFilter = () => true, removeAfterProcessing = false) {
        const components = this.childComponents.filter(kidsFilter);
        const promises = components.map(comp => comp.process(stateChange));
        return this._promiseAllSettledAndKidsRemove(promises, components, removeAfterProcessing);
    }

    /**
     * @param kidHandlerFn {function(kid: AbstractComponent): *}
     * @param kidsFilter {function(comp: AbstractComponent): boolean}
     * @param removeAfterProcessing {boolean}
     * @return {Array}
     */
    doWithKids(kidHandlerFn, kidsFilter = () => true, removeAfterProcessing = false) {
        const components = this.childComponents.filter(kidsFilter);
        return components.map(comp => kidHandlerFn(comp));
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     * When this.extractAllInputValues exists than this.extractAllEntities must use it instead of using super.extractAllEntities!
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {Array<IdentifiableEntity>}
     */
    extractAllEntities(useOwnerOnFields) {
        return this.extractAllInputValues().map(iv => EntityUtils.removeTransientId(iv));
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {Array<IdentifiableEntity>}
     */
    extractAllInputValues(useOwnerOnFields) {
        return this.doWithKids((kid) => kid.extractInputValues(useOwnerOnFields));
    }

    /**
     * @param promises {Promise<StateChange[]>[]}
     * @param components {AbstractComponent[]}
     * @param removeAfterProcessing {boolean}
     * @return {Promise}
     * @protected
     */
    _promiseAllSettledAndKidsRemove(promises, components, removeAfterProcessing) {
        return Promise.allSettled(promises).then(it => {
            if (removeAfterProcessing) {
                ArrayUtils.removeElements(this.childComponents, components);
            }
            return it;
        });
    }

    /**
     * create the child component then init it
     *
     * @return {Promise<Array<StateChange>[]>}
     */
    init() {
        this.childComponents = this._createChildComponents();
        const promises = this._initializeComponents();
        return Promise.allSettled(promises);
    }

    /**
     * @return {Promise<StateChange[]>[]}
     * @protected
     */
    _initializeComponents() {
        return this.childComponents.map(kid => kid.init());
    }

    /**
     * @return {AbstractComponent[]}
     * @protected
     */
    _createChildComponents() {
        if (this.childComponentFactories.length) {
            return this.childComponentFactories.map(compFactory => compFactory.createChildComponent(this.parentComp));
        } else {
            return this.childComponents;
        }
    }

    /**
     * childComponentFactories is "configuration" that's why is not cleared
     */
    close() {
        this.childComponents.forEach(kid => kid.close());
        this.childComponents = [];

    }
}