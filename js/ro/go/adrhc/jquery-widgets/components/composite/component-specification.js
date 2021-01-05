class ComponentSpecification {
    /**
     * @type {string}
     */
    elemSelector;
    /**
     * @type {AbstractComponentFactory}
     */
    compFactory;

    constructor(elemSelector, compFactory) {
        this.elemSelector = elemSelector;
        this.compFactory = compFactory;
    }
}