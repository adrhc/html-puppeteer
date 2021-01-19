/**
 * The child state is a property (Array type) in the parent state.
 */
class DefaultTableChildishBehaviour extends ChildishBehaviour {
    /**
     * @param parentComp {AbstractComponent}
     * @param childStateProperty {string} is the parent state's property storing the child state
     */
    constructor(parentComp, childStateProperty) {
        super(parentComp);
        this.childStateProperty = childStateProperty;
    }

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

    extractChildState(parentState) {
        return parentState[this.childStateProperty];
    }
}