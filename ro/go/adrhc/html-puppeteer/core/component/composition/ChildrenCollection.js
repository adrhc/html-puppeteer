/**
 * @typedef {Object} ChildrenCollectionOptions
 * @property {ElemIdOrJQuery=} componentsHolder is the place inside which to search for components
 * @property {AbstractContainerComponent=} parent
 * @property {ChildrenShellFinder=} childrenShellFinder
 * @property {boolean=} dontRenderChildren
 * @property {CreateComponentParams=} childrenOptions are the options used to create the components for found shells
 */

import ChildrenShellFinder from "../../view/ChildrenShellFinder.js";
import {createComponent} from "../../Puppeteer.js";
import {isTrue} from "../../../util/AssertionUtils.js";
import {partOf} from "../../../util/GlobalConfig.js";

/**
 * @template SCT, SCP
 */
export default class ChildrenCollection {
    /**
     * @type {ComponentsCollection}
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
     * @param {ChildrenCollectionOptions} options
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
     * @param {jQuery<HTMLElement>} $shell
     */
    createComponentForShell($shell) {
        const component = createComponent($shell, this.childrenOptions);
        isTrue(component != null, "[ChildrenCollection] the child's shell must exist!");
        if (this.parent != null && partOf($shell) == null) {
            // switcher (usually) uses children without "data-part"
            console.warn("[ChildrenCollection] partName is missing though parent is set!");
        }
        this.children[component.id] = this.dontRenderChildren ? component : component.render();
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
        this.children = {};
        this.childrenShellFinder.$childrenShells().forEach($shell => this.createComponentForShell($shell));
        return this.childrenArray;
    }

    /**
     * @param {string} itemId
     * @return {AbstractComponent|undefined}
     */
    getChildById(itemId) {
        return this.children[itemId];
    }

    /**
     * @param {function(c: AbstractComponent)} visitFn
     */
    accept(visitFn) {
        this.childrenArray.forEach(c => visitFn(c));
    }

    /**
     * @param {function(c: AbstractComponent)} filterFn
     * @return {AbstractComponent[]}
     */
    filter(filterFn) {
        return this.childrenArray.filter(filterFn);
    }

    /**
     * close and remove each item
     */
    closeAndRemoveChildren() {
        this.closeChildren();
        this.children = {};
    }

    /**
     * close all children
     */
    closeChildren() {
        this.childrenArray.forEach(c => c.close());
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent[]}
     */
    closeAndRemoveChildrenByPartName(partName) {
        const childrenByPartName = this.getChildrenByPartName(partName);
        if (!childrenByPartName.length) {
            console.error(`Trying to close missing child: ${partName}!`);
            return undefined;
        }
        childrenByPartName.forEach(it => {
            delete this.children[it.id];
            it.close();
        })
        return childrenByPartName;
    }

    /**
     * @param {PartName} partName
     * @return {AbstractComponent[]}
     */
    getChildrenByPartName(partName) {
        return this.childrenArray.filter(it => partName === it.partName);
    }

    /**
     * Detach event handlers then remove all children.
     */
    disconnectAndRemoveChildren() {
        this.childrenArray.forEach(child => child.disconnect());
        this.children = {};
    }

    /**
     * @param {jQuery<HTMLElement>} $shell
     * @return {boolean}
     * @protected
     */
    _hasChildrenHaving($shell) {
        return !!this.childrenArray.find(it => it.$elem[0] === $shell[0]);
    }

    /**
     * @param {jQuery<HTMLElement>} $shell
     * @return {AbstractComponent | undefined}
     */
    getChildByShell($shell) {
        return this.childrenArray.find(it => it.$elem[0] === $shell[0]);
    }
}