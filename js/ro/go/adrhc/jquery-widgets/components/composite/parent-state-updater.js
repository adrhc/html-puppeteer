/**
 * @interface
 */
class ParentStateUpdater {
    /**
     * @param parentState
     * @param childComp {AbstractComponent}
     * @return {boolean} whether an update occured or not
     */
    update(parentState, childComp) {
        return false;
    }
}