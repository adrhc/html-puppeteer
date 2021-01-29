/**
 * EditableListComponent.extractEntity (aka SelectableListComponent.extractEntity) is using selectedRow
 * instead of AbstractTableBasedComponent to extract the entity while here we need to extract table's
 * entities (aka AbstractTableBasedComponent extractEntity/extractAllEntities behaviour).
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
            console.error(`${this.constructor.name}.copyChildState: childEntities is Array while parentState is not and childStateProperty = null!`);
            throw `${this.constructor.name}.copyChildState: childEntities is Array while parentState is not and childStateProperty = null!`;
        }
    }

    /**
     * @return {AbstractTableBasedComponent}
     */
    get tableBasedComponent() {
        return this._childComp;
    }
}