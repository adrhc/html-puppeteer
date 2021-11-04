import AbstractComponent from "./AbstractComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import PartialStateHolder, {partsOf} from "../state/PartialStateHolder.js";
import ComponentIllustrator from "../state-changes-handler/ComponentIllustrator.js";
import ContainerHelper from "../../helper/ContainerHelper.js";

/**
 * @typedef {AbstractComponentOptions & ChildrenComponentsOptions} AbstractContainerComponentOptions
 * @property {ViewRemovalStrategy=} childrenRemovalStrategy
 * @property {string=} childrenRemovedPlaceholder
 * @property {string=} childrenRemovedCss
 */
/**
 * @template SCT,SCP
 */
export default class AbstractContainerComponent extends AbstractComponent {
    /**
     * @type {ChildrenComponents}
     */
    childrenComponents;

    /**
     * @return {PartialStateHolder}
     */
    get partialStateHolder() {
        return /** @type {PartialStateHolder} */ this.stateHolder;
    }

    /**
     * @param {AbstractContainerComponentOptions} options
     */
    constructor(options) {
        super(withDefaults(options)
            .withStateHolderProvider(c => new PartialStateHolder(c.config))
            // partial changes are not changing the container's view - that's
            // why ComponentIllustrator is used instead of SimplePartsIllustrator
            .addStateChangesHandlerProvider((component) =>
                (component.config.componentIllustrator ?? new ComponentIllustrator(component.config)))
            .options());
        const helper = new ContainerHelper(this);
        this.childrenComponents = helper.createChildrenComponents();
    }

    /**
     * @param {PartName} partName
     * @param {boolean=} dontClone
     * @return {*}
     */
    getPart(partName, dontClone) {
        return this.partialStateHolder.getPart(partName, dontClone);
    }

    /**
     * @param {OptionalPartName=} previousPartName
     * @param {SCP=} newPart
     * @param {OptionalPartName=} newPartName
     * @param {boolean=} dontRecordChanges
     */
    replacePart(previousPartName, newPart, newPartName, dontRecordChanges) {
        this.doWithState(partialStateHolder =>
            partialStateHolder.replacePart(previousPartName, newPart, newPartName, dontRecordChanges));
    }

    /**
     * Replaces some component's state parts; the parts should have no name change!.
     *
     * @param {{[name: PartName]: SCP} | SCT} parts
     */
    replaceParts(parts) {
        partsOf(parts).forEach(([key, value]) => this.replacePart(key, value));
    }

    /**
     * Detach event handlers.
     */
    disconnect() {
        this.childrenComponents.disconnectAndRemoveChildren();
        super.disconnect();
    }
}