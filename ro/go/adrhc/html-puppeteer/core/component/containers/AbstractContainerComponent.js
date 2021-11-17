import AbstractComponent from "../AbstractComponent.js";
import {withDefaults} from "../options/ComponentOptionsBuilder.js";
import PartialStateHolder, {partsOf} from "../../state/PartialStateHolder.js";
import {componentIllustratorOf} from "../../state-changes-handler/ComponentIllustrator.js";
import ContainerHelper from "../../../helper/ContainerHelper.js";

/**
 * @typedef {AbstractComponentOptions & ComponentIllustratorOptions & ChildrenCollectionOptions} AbstractContainerComponentOptions
 * @property {ViewRemovalStrategy=} childrenRemovalStrategy
 * @property {string=} childrenRemovedPlaceholder
 * @property {string=} childrenRemovedCss
 */
/**
 * @template SCT,SCP
 */
export default class AbstractContainerComponent extends AbstractComponent {
    /**
     * @type {ChildrenCollection}
     */
    childrenCollection;
    /**
     * @type {ChildrenShellFinder}
     */
    childrenShellFinder;
    /**
     * @type {ContainerHelper}
     */
    containerHelper;

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
            .withStateHolderProvider(config => new PartialStateHolder(config))
            // the container's view should not be updated by the container's view
            // when partial changes occur; that's the children responsibility hence
            // ComponentIllustrator is used instead of SimplePartsIllustrator
            .addIfMissingComponentIllustratorProvider(
                component => componentIllustratorOf(component))
            .options());
        this.containerHelper = new ContainerHelper(this);
        this.childrenShellFinder = this.containerHelper.createChildrenShellFinder();
        this.childrenCollection = this.containerHelper.createChildrenCollection();
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
        const partName = this.childrenCollection.getChildById(childId).partName;
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
     * Creates the children for all existing shells.
     */
    createChildrenForAllShells() {
        this.childrenCollection.removeAll();
        this.childrenShellFinder.$getAllChildrenShells()
            .forEach($shell => this.childrenCollection.createComponentForShell($shell));
    }

    /**
     * closes the component
     */
    close() {
        this.childrenCollection.closeAndRemoveAll();
        super.close();
    }

    /**
     * Detach event handlers.
     */
    disconnect() {
        this.childrenCollection.disconnectAll();
        super.disconnect();
    }
}