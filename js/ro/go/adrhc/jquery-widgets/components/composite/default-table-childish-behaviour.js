/**
 * EditableListComponent.extractEntity (aka SelectableListComponent.extractEntity)
 * is using selectedRow to extract the entity while we need to extract all of them
 * (i.e. AbstractTableBasedComponent extractEntity/extractAllEntities behaviour).
 *
 * Here the child state is a property (Array type) in the parent state.
 */
class DefaultTableChildishBehaviour extends DefaultChildishBehaviour {
    /**
     * @param parentState {Person}
     * @param [useOwnerOnFields] {boolean}
     * @return {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        const childEntities = this.tableBasedComponent.extractAllEntities(useOwnerOnFields);
        if (!!this.childStateProperty) {
            parentState[this.childStateProperty] = childEntities;
        } else if (childEntities == null) {
            console.log(`${this.constructor.name}.copyChildState: childStateProperty and childEntities are both null`);
        } else if ($.isArray(parentState)) {
            console.log(`${this.constructor.name}.copyChildState: childStateProperty is null`);
            parentState.length = 0;
            parentState.push(...childEntity);
        } else {
            console.log(`${this.constructor.name}.copyChildState: childEntities is Array while parentState is not!`);
            throw `${this.constructor.name}.copyChildState`;
        }
    }

    /**
     * @return {AbstractTableBasedComponent}
     */
    get tableBasedComponent() {
        return this._childComp;
    }
}