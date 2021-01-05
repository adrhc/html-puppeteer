class ChildComponentSpecification {
    /**
     * @type {string}
     */
    elemSelector;
    /**
     * @type {AbstractComponentFactory|function}
     */
    compFactory;
    /**
     * @type {ParentStateUpdater|function}
     */
    parentStateUpdater;

    /**
     * @param elemSelector {string}
     * @param compFactory {AbstractComponentFactory|function}
     * @param parentStateUpdater {ParentStateUpdater|function}
     */
    constructor(elemSelector, compFactory, parentStateUpdater) {
        this.elemSelector = elemSelector;
        this.compFactory = compFactory;
        this.parentStateUpdater = parentStateUpdater;
    }
}