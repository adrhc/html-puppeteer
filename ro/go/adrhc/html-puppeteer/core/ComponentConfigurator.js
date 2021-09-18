export default class ComponentConfigurator {
    /**
     * @param {AbstractComponent} component
     */
    configure(component) {}
}

/**
 * @param {AbstractComponent} component
 */
export function applyExtraConfigurators(component) {
    component.config.extraConfigurators?.forEach(c => c.configure(component));
}