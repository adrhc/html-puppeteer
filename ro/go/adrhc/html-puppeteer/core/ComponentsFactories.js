import SimpleComponent from "./SimpleComponent.js";

class ComponentsFactory {
    TYPES = {"simple": (options) => new SimpleComponent(options)};

    /**
     * @param {string} type
     * @param {{}=} options
     * @return {AbstractComponent}
     */
    create(type, options) {
        const component = this.TYPES[type]?.(options);
        if (!component) {
            throw new Error(`Bad component type: ${type}!`);
        }
        return component;
    }

    registerType(type, factory) {
        this.TYPES[type] = factory;
    }
}

const COMPONENTS_FACTORY = new ComponentsFactory();
export default COMPONENTS_FACTORY;
