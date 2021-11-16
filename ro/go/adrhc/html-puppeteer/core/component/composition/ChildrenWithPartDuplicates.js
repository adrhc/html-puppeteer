import ChildrenShellFinder from "../../view/ChildrenShellFinder.js";
import {partOf} from "../../../util/GlobalConfig.js";
import {createComponent} from "../../Puppeteer.js";
import {isTrue} from "../../../util/AssertionUtils.js";

/**
 * @typedef {Object} ChildrenWithPartDuplicatesOptions
 * @property {ElemIdOrJQuery=} componentsHolder is the place inside which to search for components
 * @property {AbstractContainerComponent=} parent
 * @property {ChildrenShellFinder=} childrenShellFinder
 * @property {boolean=} dontRenderChildren
 * @property {CreateComponentParams=} childrenOptions are the options used to create the components for found shells
 */

/**
 * @template SCT, SCP
 */
export default class ChildrenWithPartDuplicates {
    /**
     * @type {AbstractComponent[]}
     */
    children = {};
    /**
     * @type {CreateComponentParams}
     */
    childrenOptions
    /**
     * @type {ChildrenShellFinder}
     */
    childrenShellFinder;
    /**
     * @type {boolean}
     */
    dontRenderChildren;
    /**
     * @type {AbstractComponent}
     */
    parent;

    /**
     * @return {AbstractComponent[]}
     */
    get childrenArray() {
        return Object.values(this.children);
    }

    /**
     * @param {ChildrenWithPartDuplicatesOptions} options
     * @param {ElemIdOrJQuery=} options.componentsHolder
     * @param {AbstractComponent=} options.parent
     * @param {ChildrenShellFinder=} options.childrenShellFinder
     * @param {boolean=} options.dontRenderChildren
     * @param {CreateComponentParams=} options.childrenOptions
     */
    constructor({componentsHolder, parent, childrenShellFinder, dontRenderChildren, childrenOptions}) {
        this.parent = parent;
        this.dontRenderChildren = dontRenderChildren;
        this.childrenOptions = {parent, ...childrenOptions};
        // Puppeteer.anime() will provide an empty parent and elemIdOrJQuery
        const elemIdOrJQuery = componentsHolder ?? parent?.config.elemIdOrJQuery ?? document;
        this.childrenShellFinder = childrenShellFinder ?? new ChildrenShellFinder(elemIdOrJQuery);
    }

    /**
     * - purge this.children collection
     * - detect existing shells
     * - create the components corresponding to shells
     * - store the components into this.children collection
     * - render all children
     *
     * @return {AbstractComponent[]}
     */
    createChildrenForExistingShells() {
        this.children = [];
        this.childrenShellFinder.$childrenShells().forEach($shell => this._createComponent($shell));
        return this.childrenArray;
    }

    /**
     * @param {jQuery<HTMLElement>} $shell
     * @param {OptionalPartName=} partName
     */
    createOrUpdateChild($shell, partName = partOf($shell)) {
        if (!$shell.length) {
            console.warn(`Missing child element for ${partName}!`);
            return;
        }
        if (this.hasChildrenHaving(partName)) {
            this.updateFromParent(partName);
            return;
        }
        // at this point the item component's id is available as data-GlobalConfig.COMPONENT_ID on $shell
        this._createComponent($shell, partName);
    }

    /**
     * @param {jQuery<HTMLElement>} $shell
     * @param {OptionalPartName=} partName
     * @protected
     */
    _createComponent($shell, partName = partOf($shell)) {
        const component = createComponent($shell, this.childrenOptions);
        isTrue(component != null, "[ChildrenComponents] the child's shell must exist!");
        if (this.parent != null && partName == null) {
            // switcher (usually) uses children without "data-part"
            console.warn("[ChildrenComponents] partName is missing though parent is set!");
        }
        this.children[component.id] = this.dontRenderChildren ? component : component.render();
    }

    /**
     * @param {PartName} partName
     */
    updateFromParent(partName) {
        this.getChildByPartName(partName).forEach(it => it.replaceFromParent());
    }

    /**
     * @param {PartName} partName
     * @return {boolean}
     */
    closeAndRemoveChild(partName) {
        const childrenWithSamePartName = this.getChildByPartName(partName)
        if (!childrenWithSamePartName?.length) {
            console.error(`Trying to close missing child: ${partName}!`);
            return false;
        }
        childrenWithSamePartName.forEach(it => {
            delete this.children[it.id];
            it.close();
        });
        return true;
    }

    /**
     * close and remove each item
     */
    closeAndRemoveChildren() {
        this.childrenArray.forEach(it => this.closeAndRemoveChild(it.partName));
    }

    /**
     * close all children
     */
    closeChildren() {
        this.childrenArray.forEach(c => c.close());
    }

    /**
     * Detach event handlers then remove all children.
     */
    disconnectAndRemoveChildren() {
        this.childrenArray.forEach(child => child.disconnect());
        this.children = {};
    }

    /**
     * @param {string} itemId
     * @return {AbstractComponent|undefined}
     */
    getChildById(itemId) {
        return this.children[itemId];
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent[]}
     */
    getChildByPartName(partName) {
        return this.childrenArray.filter(it => it.partName === partName);
    }

    /**
     * @param {PartName} partName
     * @return {boolean}
     */
    hasChildrenHaving(partName) {
        return !!this.childrenArray.find(it => it.partName === partName);
    }

    /**
     * @param {function(c: AbstractComponent)} visitFn
     */
    accept(visitFn) {
        this.childrenArray.forEach(c => visitFn(c));
    }
}