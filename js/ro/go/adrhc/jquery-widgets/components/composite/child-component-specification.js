class ChildComponentSpecification {
    /**
     * @type {string}
     */
    elemSelector;
    /**
     * @type {ParentStateUpdater|function}
     */
    parentStateUpdater;
    /**
     * @type {AbstractComponentFactory|function}
     */
    componentFactory;

    /**
     * @param elemSelector {string}
     * @param parentStateUpdater {ParentStateUpdater|function}
     * @param compFactory {AbstractComponentFactory|function}
     */
    constructor(elemSelector, parentStateUpdater, compFactory) {
        this.elemSelector = elemSelector;
        this.componentFactory = compFactory;
        this.parentStateUpdater = parentStateUpdater;
    }

    /**
     * @param $parentElem {jQuery<HTMLElement>}
     * @return {jQuery<HTMLElement>}
     * @protected
     */
    _childOf($parentElem) {
        return $(this.elemSelector, $parentElem);
    }

    /**
     * @param parentState
     * @param childComp {AbstractComponent}
     * @return {boolean} whether an update occurred or not
     */
    updateParentState(parentState, childComp) {
        if (typeof this.parentStateUpdater === "function") {
            return this.parentStateUpdater(parentState, childComp);
        } else {
            return this.parentStateUpdater.update(parentState, childComp);
        }
    }

    /**
     * @param parentComp {AbstractComponent}
     * @return {AbstractComponent}
     */
    createComp(parentComp) {
        const $elem = this._childOf(parentComp.view.$elem);
        if (typeof this.componentFactory === "function") {
            return this.componentFactory($elem, parentComp.state);
        } else {
            return this.componentFactory.create($elem, parentComp.state);
        }
    }
}