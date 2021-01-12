/**
 * Creates the capability to update a CreateDeleteListComponent's parent state (snapshot).
 * The "capability" must be attached to a CreateDeleteListComponent instance!
 */
class CatsCreateDeleteListChildishBehaviour extends ChildishBehaviour {
    /**
     * @param parentComp {AbstractComponent}
     * @param parentProperty {string} is the parentState property where to save the selectedItem
     */
    constructor(parentComp, parentProperty) {
        super(parentComp);
        this.parentProperty = parentProperty;
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner is used otherwise useOwnerOnFields is considered.
     *
     * @param parentState {Person}
     * @param [useOwnerOnFields] {boolean}
     * @return {boolean}
     */
    copyChildState(parentState, useOwnerOnFields) {
        /**
         * @type {CreateDeleteListComponent}
         */
        const createDeleteListComponent = this._childComp;
        parentState[this.parentProperty] = createDeleteListComponent.extractAllEntities(useOwnerOnFields);
        return true;
    }
}