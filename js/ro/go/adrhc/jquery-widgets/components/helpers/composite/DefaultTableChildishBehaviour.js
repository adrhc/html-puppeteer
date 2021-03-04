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
    updateParentFromChildView(parentState, useOwnerOnFields) {
        const childEntities = this.tableBasedComponent.extractAllEntities(useOwnerOnFields);
        if (!!this.childProperty) {
            parentState[this.childProperty] = childEntities;
        } else if (childEntities == null) {
            console.log(`${this.constructor.name}.updateParentFromChildView: childProperty and childEntities are both null`);
        } else if ($.isArray(parentState)) {
            console.log(`${this.constructor.name}.updateParentFromChildView: childProperty is null`);
            parentState.length = 0;
            parentState.push(...childEntity);
        } else {
            console.error(`${this.constructor.name}.updateParentFromChildView: childEntities is Array while parentState is not and childProperty = null!`);
            throw `${this.constructor.name}.updateParentFromChildView: childEntities is Array while parentState is not and childProperty = null!`;
        }
    }

    /**
     * @return {AbstractTableBasedComponent}
     */
    get tableBasedComponent() {
        return this._childComp;
    }
}