/**
 * @interface
 */
class ChildComponentFactory {
    /**
     * @param parentComp {AbstractComponent}
     * @return {AbstractComponent}
     */
    createComp(parentComp) {
        throw "Not implemented!";
    }
}