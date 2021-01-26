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
        console.error(`${this.constructor.name}.createChildComponent is not implemented!`);
        throw `${this.constructor.name}.createChildComponent is not implemented!`;
    }
}