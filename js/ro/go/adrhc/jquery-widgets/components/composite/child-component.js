/**
 * this encapsulates the "child component" capability of a component
 */
class ChildComponent {
    /**
     * kidComp means "me/this/current" relative to ChildComponent
     *
     * @type {AbstractComponent}
     */
    _kidComp
    /**
     * @type {AbstractComponent}
     */
    parentComp;

    /**
     * @param parentComp {AbstractComponent|undefined}
     */
    constructor(parentComp) {
        this.parentComp = parentComp;
    }

    get kidComp() {
        return this._kidComp;
    }

    set kidComp(value) {
        this._kidComp = value;
    }

    /**
     * @param parentState
     * @return {boolean} whether something was copied or not
     */
    copyKidState(parentState) {
        return false;
    }
}