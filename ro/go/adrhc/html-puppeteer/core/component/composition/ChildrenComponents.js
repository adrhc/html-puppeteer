import {createComponent} from "../../Puppeteer.js";
import {isTrue} from "../../../util/AssertionUtils.js";
import ChildrenShellFinder from "../../view/ChildrenShellFinder.js";
import {partOf} from "../../../util/GlobalConfig.js";

/**
 * @typedef {Object} ChildrenComponentsOptions
 * @property {ElemIdOrJQuery=} componentsHolder is the place inside which to search for components
 * @property {BasicContainerComponent=} parent
 * @property {ChildrenShellFinder=} childrenShellFinder
 * @property {boolean=} dontRenderChildren
 * @property {ChildrenCreationCommonOptions=} childrenCreationCommonOptions
 */
/**
 * @typedef {{[name: string]: AbstractComponent}} ComponentsCollection
 */
/**
 * @template SCT, SCP
 */
export default class ChildrenComponents {
    /**
     * @type {ComponentsCollection}
     */
    children = {};
    /**
     * @type {Object}
     */
    childrenCreationCommonOptions
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
     * @param {ChildrenComponentsOptions} options
     * @param {ElemIdOrJQuery=} options.componentsHolder
     * @param {AbstractComponent=} options.parent
     * @param {ChildrenShellFinder=} options.childrenShellFinder
     * @param {boolean=} options.dontRenderChildren
     * @param {ChildrenCreationCommonOptions=} options.childrenCreationCommonOptions
     */
    constructor({componentsHolder, parent, childrenShellFinder, dontRenderChildren, childrenCreationCommonOptions}) {
        this.parent = parent;
        this.dontRenderChildren = dontRenderChildren;
        this.childrenCreationCommonOptions = childrenCreationCommonOptions;
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
     * @return {ComponentsCollection}
     */
    createChildrenForExistingShells() {
        this.children = {};
        this.childrenShellFinder.$childrenShells().forEach($shell => this._createComponent($shell));
        return {...this.children};
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
        if (this.children[partName]) {
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
        const component = createComponent($shell, {parent: this.parent, ...this.childrenCreationCommonOptions});
        isTrue(component != null, "[ChildrenComponents] the child's shell must exist!");
        isTrue(partName != null || this.parent == null,
            "[ChildrenComponents] partName is missing while having a parent!");
        this.children[partName ?? component.id] = this.dontRenderChildren ? component : component.render();
    }

    /**
     * @param {PartName} partName
     */
    updateFromParent(partName) {
        this.children[partName].replaceFromParent();
    }

    /**
     * @param {PartName} partName
     * @return {boolean}
     */
    closeAndRemoveChild(partName) {
        if (!this.children[partName]) {
            console.error(`Trying to close missing child: ${partName}!`);
            return false;
        }
        this.children[partName].close();
        delete this.children[partName];
        return true;
    }

    /**
     * close and remove each item
     */
    closeAndRemoveChildren() {
        Object.keys(this.children).forEach(partName => this.closeAndRemoveChild(partName));
    }

    /**
     * close all children
     */
    closeChildren() {
        Object.keys(this.children).forEach(partName => this.children[partName].close());
    }

    /**
     * Detach event handlers then remove all children.
     */
    disconnectAndRemoveChildren() {
        Object.values(this.children).forEach(child => child.disconnect());
        this.children = {};
    }

    /**
     * @param {string} itemId
     * @return {AbstractComponent|undefined}
     */
    getChildById(itemId) {
        return Object.values(this.children).find(it => it.id === itemId);
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent}
     */
    getChildByPartName(partName) {
        return this.children[partName];
    }
}