import AbstractComponent from "./AbstractComponent.js";
import {withDefaults} from "./options/ComponentOptionsBuilder.js";
import PartialStateHolder, {partsOf} from "../state/PartialStateHolder.js";
import {componentIllustratorOf} from "../state-changes-handler/ComponentIllustrator.js";
import ContainerHelper from "../../helper/ContainerHelper.js";

/**
 * @typedef {AbstractComponentOptions & ComponentIllustratorOptions & ChildrenComponentsOptions} AbstractContainerComponentOptions
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
    constructor({componentIllustratorProviders, ...restOfOptions}) {
        super(withDefaults(restOfOptions)
            .withStateHolderProvider(config => new PartialStateHolder(config))
            // the container's view should not be updated by the container's view
            // when partial changes occur, that's the children responsibility that's
            // why ComponentIllustrator is used instead of SimplePartsIllustrator
            .addComponentIllustratorProvider(component =>
                componentIllustratorOf(component), !!componentIllustratorProviders?.length)
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
     * @param {string} childId
     * @param {SCP=} newPart
     * @param {PartName=} newPartName
     */
    replacePartByChildId(childId, newPart, newPartName) {
        const partName = this.childrenComponents.getChildById(childId).partName;
        this.replacePart(partName, newPart, newPartName);
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