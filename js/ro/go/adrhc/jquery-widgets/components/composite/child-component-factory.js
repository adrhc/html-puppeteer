class ChildComponentFactory {
    /**
     * @type {string}
     */
    elemSelector;
    /**
     * @type {function($elem: jQuery<HTMLElement>, state: BasicState)}
     */
    componentFactory;

    /**
     * @param elemSelector {string}
     * @param compFactory {function($elem: jQuery<HTMLElement>, state: BasicState)}
     */
    constructor(elemSelector, compFactory) {
        this.elemSelector = elemSelector;
        this.componentFactory = compFactory;
    }

    /**
     * @param parentComp {AbstractComponent}
     * @return {jQuery<HTMLElement>}
     * @protected
     */
    _childOf(parentComp) {
        return $(this.elemSelector, parentComp.view.$elem);
    }

    /**
     * @param parentComp {AbstractComponent}
     * @return {AbstractComponent}
     */
    createComp(parentComp) {
        const $elem = this._childOf(parentComp.view.$elem);
        return this.componentFactory($elem, parentComp.state);
    }
}