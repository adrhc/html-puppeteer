import StateInitializer from "./StateInitializer.js";

/**
 * @template SCT, SCP
 */
export default class ChildStateInitializer extends StateInitializer {
    /**
     * @param {AbstractComponent<SCT, SCP>} component
     */
    load(component) {
        component.replaceFromParent();
    }
}