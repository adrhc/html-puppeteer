import SimpleComponent from "./SimpleComponent.js";

class ComponentsFactory {
    /**
     * @param {string} type
     * @param {{}=} options
     * @return {AbstractComponent}
     */
    create(type, options) {
        switch (type) {
            case "simple":
                return new SimpleComponent(options);
            default:
                throw new Error(`Bad component type: ${type}!`);
        }
    }
}

const COMPONENTS_FACTORY = new ComponentsFactory();
export default COMPONENTS_FACTORY;
