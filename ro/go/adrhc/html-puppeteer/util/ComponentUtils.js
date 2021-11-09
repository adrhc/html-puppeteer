import {partsOf} from "../core/state/PartialStateHolder.js";

/**
 * Replaces some component's state parts; the parts should have no name change!
 *
 * @param {AbstractComponent} component
 * @param {{[name: PartName]: *}[]} parts
 */
export function replaceParts(component, parts) {
    if (typeof component.replaceParts === "function") {
        component.replaceParts(parts);
    } else if (typeof component.replacePart === "function") {
        partsOf(parts).forEach(([key, value]) => component.replacePart(key, value));
    } else {
        alert(`component ${component.id} can't do partial replace! config:\n${JSON.stringify(component.config)}`);
    }
}