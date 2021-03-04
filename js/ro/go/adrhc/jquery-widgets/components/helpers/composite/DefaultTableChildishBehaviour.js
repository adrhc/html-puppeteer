/**
 * EditableListComponent.extractEntity (aka SelectableListComponent.extractEntity) is using selectedRow
 * instead of AbstractTableBasedComponent to extract the entity while here we need to extract table's
 * entities (aka AbstractTableBasedComponent extractEntity/extractAllEntities behaviour).
 *
 * Here the child state is a property (Array type) in the parent state.
 */
class DefaultTableChildishBehaviour extends DefaultChildishBehaviour {
    /**
     * @param {boolean} useOwnerOnFields
     * @return {IdentifiableEntity[]}
     * @protected
     */
    _extractChildEntity(useOwnerOnFields) {
        return this.tableBasedComponent.extractAllEntities(useOwnerOnFields);
    }

    /**
     * @return {AbstractTableBasedComponent}
     */
    get tableBasedComponent() {
        return this.childComp;
    }
}