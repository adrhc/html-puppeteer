class SelectableListEntityExtractor extends DefaultEntityExtractor {
    /**
     * @type {SelectableListComponent}
     */
    selectableList;

    constructor(component) {
        super(component);
        this. selectableList = component;
    }

    /**
     * This could be considered the extracted-entity behaviour of the component or a new behaviour.
     * To abey the Liskov Substitution Principle principle (see SOLID principles) I consider this new behaviour.
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {{}}
     */
    extractSelectedEntity(useOwnerOnFields) {
        const selectedRow = this.selectableList.selectedRowComponent;
        return selectedRow ? selectedRow.extractEntity(useOwnerOnFields) : undefined;
    }

    extractEntity(useOwnerOnFields) {
        return this.extractSelectedEntity();
    }
}