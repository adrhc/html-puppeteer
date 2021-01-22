/**
 * The child state is a property (Array type) in the parent state.
 */
class DefaultTableChildishBehaviour extends DefaultChildishBehaviour {
    /**
     * @param parentState {Person}
     * @param [useOwnerOnFields] {boolean}
     * @return {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        parentState[this.childStateProperty] = this.tableBasedComponent.extractAllEntities(useOwnerOnFields);
    }

    /**
     * @return {AbstractTableBasedComponent}
     */
    get tableBasedComponent() {
        return this._childComp;
    }
}