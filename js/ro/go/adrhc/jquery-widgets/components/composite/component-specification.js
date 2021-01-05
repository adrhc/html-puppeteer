class ComponentSpecification {
    /**
     * @type {string}
     */
    elemSelector;
    /**
     * @type {AbstractComponentFactory|function}
     */
    compFactory;

    constructor(elemSelector, compFactory) {
        this.elemSelector = elemSelector;
        this.compFactory = compFactory;
    }
}