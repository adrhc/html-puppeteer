class SelectableSimpleList {
    /**
     * @param simpleListComponent {SimpleListComponent}
     */
    constructor(simpleListComponent) {
        this.simpleListComponent = simpleListComponent;
    }

    /**
     * component initializer
     */
    init() {
        this.simpleListComponent.init();
    }
}