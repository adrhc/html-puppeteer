import ValueStateInitializer from "./ValueStateInitializer.js";
import {isStateEmpty} from "../../state/StateHolder.js";

/**
 * @template SCT, SCP
 */
export default class ChildStateInitializer extends ValueStateInitializer {
    /**
     * @param {AbstractComponent<SCT, SCP>} component
     */
    load(component) {
        component.replaceFromParent();
        if (component.isStateEmpty() && !isStateEmpty(this.value)) {
            super.load(component);
        }
    }
}