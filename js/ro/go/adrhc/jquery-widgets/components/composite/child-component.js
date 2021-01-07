/**
 * this encapsulates the "child component" capability of a component
 */
class ChildComponent {
    /**
     * kidComp means "me/this/current" relative to ChildComponent
     *
     * @type {AbstractComponent}
     */
    kidComp
    /**
     * @type {AbstractComponent}
     */
    parentComp;

    /**
     * @param myComp {AbstractComponent|undefined}
     * @param parentComp {AbstractComponent|undefined}
     */
    constructor(myComp, parentComp) {
        this.kidComp = myComp;
        this.parentComp = parentComp;
    }

    /**
     * @param parentState
     * @return {boolean} whether something was copied or not
     */
    copyKidState(parentState) {
        return false;
    }
}