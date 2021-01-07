/**
 * @abstract
 */
class ChildComponentFactory {
    /**
     * @param parentComp {AbstractComponent}
     * @return {AbstractComponent}
     * @abstract
     */
    createComp(parentComp) {
        throw "Not implemented!";
    }
}