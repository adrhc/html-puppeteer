/**
 * this encapsulates the "child component" capability of a component
 */
class ChildComponent {
    /**
     * @type {AbstractComponent}
     */
    myComp
    /**
     * @type {AbstractComponent}
     */
    parentComp;

    /**
     * @param myComp {AbstractComponent|undefined}
     * @param parentComp {AbstractComponent|undefined}
     */
    constructor(myComp, parentComp) {
        this.myComp = myComp;
        this.parentComp = parentComp;
    }

    /**
     * @param parentState
     * @return {boolean} whether an update occurred or not
     */
    updateParentState(parentState) {
        return false;
    }
}