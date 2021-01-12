/**
 * @abstract
 */
class ChildComponentFactory {
    /**
     * @param parentComp {AbstractComponent}
     * @return {AbstractComponent}
     * @abstract
     */
    createChildComponent(parentComp) {
        throw `${this.constructor.name}.createChildComponent is not implemented!`;
    }
}