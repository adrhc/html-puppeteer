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
    process(stateChange, kidsFilter, removeAfterProcessing = false) {
        const components = this.childComponents.filter(kidsFilter);
        const promises = components.map(comp => comp.process(stateChange));
        return this._promiseAllSettledAndKidsRemove(promises, components, removeAfterProcessing);
    }

    /**
     * @param kidHandlerFn {function(kid: AbstractComponent)}
     * @param kidsFilter {function(comp: AbstractComponent): boolean}
     * @param removeAfterProcessing {boolean}
     * @return {Promise}
     */
    doWithKids(kidHandlerFn, kidsFilter, removeAfterProcessing = false) {
        const components = this.childComponents.filter(kidsFilter);
        const promises = components.map(comp => kidHandlerFn(comp));
        return this._promiseAllSettledAndKidsRemove(promises, components, removeAfterProcessing);
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
        this.childComponents = this._createComponents();
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
    _createComponents() {
        if (this.childComponentFactories.length) {
            return this.childComponentFactories.map(compFactory => compFactory.createComp(this.parentComp));
        } else {
            return this.childComponents;
        }
    }

    close() {
        this.childComponents.forEach(kid => kid.close());
        this.childComponents = [];
    }
}