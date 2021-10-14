import ValueStateInitializer from "./ValueStateInitializer.js";

/**
 * @template SCT, SCP
 */
export default class ChildStateInitializer extends ValueStateInitializer {
    /**
     * @param {AbstractComponent<SCT, SCP>} component
     */
    load(component) {
        component.replaceFromParent();
        if (component.stateIsNull() && this.value != null) {
            super.load(component);
        }
    }
}