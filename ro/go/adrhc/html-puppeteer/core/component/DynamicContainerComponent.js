import SimpleContainerComponent from "./SimpleContainerComponent.js";
import {jQueryOf} from "../../util/DomUtils.js";
import {partsOf} from "../state/PartialStateHolder.js";

/**
 * @typedef {AbstractComponentOptions} DynamicContainerComponentOptions
 * @property {boolean} newChildrenGoLast
 */
/**
 * @template SCT, SCP
 * @extends {AbstractComponent}
 */
export default class DynamicContainerComponent extends SimpleContainerComponent {
    /**
     * @type {boolean}
     */
    newChildrenGoLast;

    /**
     * ChildrenShells have the chance to use parentHtml for children shells.
     * We have to set htmlTemplate to something not null (by default "") to
     * avoid the drawing of the parent's html which by now is a candidate
     * for the children shell template.
     *
     * @param {SimpleContainerComponentOptions} options
     */
    constructor(options) {
        super({parentHtml: jQueryOf(options.elemIdOrJQuery).html(), htmlTemplate: "", ...options});
        this.newChildrenGoLast = this.config.newChildrenGoLast;
    }

    /**
     * Replaces some component's state parts; the parts should have no name change!.
     *
     * @param {{[name: PartName]: SCP}[]|SCT} parts
     */
    replaceParts(parts) {
        partsOf(parts, !this.newChildrenGoLast)
            .forEach(([key, value]) => this.replacePart(key, value));
    }

    /**
     * Completely replaces the component's state.
     *
     * @param {SCT=} newState
     */
    replaceState(newState) {
        // initializing the container state with [] or {} depending on the newState
        // the container's view will kick in to render its static content (if any)
        this._replaceContainerStateOnly(newState);
        // each newState's field is considered a "part"
        this.replaceParts(newState);
    }

    /**
     * @param {SCT=} newState
     * @protected
     */
    _replaceContainerStateOnly(newState) {
        if (newState == null) {
            super.replaceState(newState);
        } else {
            super.replaceState(_.isArray(newState) ? [] : {});
        }
    }
}