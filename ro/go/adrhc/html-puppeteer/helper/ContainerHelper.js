import ChildrenComponents from "../core/component/composition/ChildrenComponents.js";
import ChildrenShells from "../core/view/ChildrenShells.js";
import ChildrenShellFinder from "../core/view/ChildrenShellFinder.js";
import {partsOf} from "../core/state/PartialStateHolder.js";

/**
 * @typedef {Object} ChildrenCreationCommonOptions
 * @property {ViewRemovalStrategy=} viewRemovalStrategy
 * @property {string=} removedPlaceholder
 * @property {string=} removedCss
 */
export default class ContainerHelper {
    /**
     * @type {AbstractComponent}
     */
    component;

    /**
     * @return {ComponentConfigField}
     */
    get config() {
        return this.component.config;
    }

    /**
     * @param {AbstractComponent} component
     */
    constructor(component) {
        this.component = component;
    }

    /**
     * @return {ChildrenCreationCommonOptions}
     */
    createChildrenCreationCommonOptions() {
        return _.defaults({}, this.config.childrenCreationCommonOptions, {
            viewRemovalStrategy: this.config.childrenRemovalStrategy,
            removedPlaceholder: this.config.childrenRemovedPlaceholder,
            removedCss: this.config.childrenRemovedCss,
        });
    }

    /**
     * @return {ChildrenShellFinder}
     */
    createChildrenShellFinder() {
        return this.config.childrenShellFinder ?? new ChildrenShellFinder(this.config.elemIdOrJQuery);
    }

    /**
     * @return {ChildrenComponents}
     */
    createChildrenComponents() {
        return this.childrenComponentsOf(this.createChildrenShellFinder());
    }

    /**
     * @param {ChildrenShellFinder} childrenShellFinder
     * @return {ChildrenComponents}
     */
    childrenComponentsOf(childrenShellFinder) {
        return new ChildrenComponents({
            parent: this.component,
            childrenShellFinder,
            dontRenderChildren: this.config.dontRenderChildren,
            childrenCreationCommonOptions: this.createChildrenCreationCommonOptions()
        });
    }

    /**
     * @return {ChildrenShells}
     */
    createChildrenShells() {
        return this.childrenShellsOf(this.createChildrenShellFinder());
    }

    /**
     * @param {ChildrenShellFinder} childrenShellFinder
     * @return {ChildrenShells}
     */
    childrenShellsOf(childrenShellFinder) {
        return new ChildrenShells({
            componentId: this.component.id, childrenShellFinder, ...this.config
        });
    }
}

/**
 * @param {PartName=} previousPartName
 * @param {*=} newPart
 * @param {PartName=} newPartName
 * @param {boolean=} dontRecordChanges
 */
export function replacePart(previousPartName, newPart, newPartName, dontRecordChanges) {
    this.doWithState(partialStateHolder =>
        partialStateHolder.replacePart(previousPartName, newPart, newPartName, dontRecordChanges));
}

/**
 * Replaces some component's state parts; the parts should have no name change!.
 *
 * @param {{[name: PartName]: *}} parts
 */
export function replaceParts(parts) {
    partsOf(parts).forEach(([key, value]) => this.replacePart(key, value));
}