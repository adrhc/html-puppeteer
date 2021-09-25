/**
 * @template SCT, SCP
 * @interface
 */
export default class StateInitializer {
    /**
     * @param {AbstractComponent<SCT, SCP>} component
     */
    load(component) {}
}