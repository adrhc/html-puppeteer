import AbstractView from "./AbstractView.js";
import {jQueryOf} from "../../util/DomUtils.js";
import GlobalConfig from "../../util/GlobalConfig.js";
import {dataOwnerSelectorOf, dataPartSelectorOf} from "../../util/SelectorUtils.js";
import {generateHtml} from "../../util/HtmlGenerator.js";
import {uniqueId} from "../../util/StringUtils.js";
import shellTemplateOf, {shellTemplateOptionsAreEmpty} from "./ChildShellTemplate.js";
import {isFalse} from "../../util/AssertionUtils.js";

/**
 * @typedef {Bag} SeatAttributes
 * @property {string=} templateId is used by child's component to populate its space (aka shell)
 * @property {string=} componentType
 * @property {string=} htmlTag
 */
/**
 * @typedef {ChildShellTemplateOptions} ChildrenShellsViewOptions
 * @property {string} componentId
 * @property {string|jQuery<HTMLElement>=} elemIdOrJQuery is the parent's element id or jQuery<HTMLElement>
 * @property {boolean=} newGuestsGoLast
 * @property {boolean=} persistentShells
 */
/**
 * @extends {AbstractView}
 */
export default class ChildrenShellsView extends AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $containerElem;
    /**
     * it's the child shell template id
     *
     * @type {string}
     */
    parentId;
    /**
     * @type {boolean}
     */
    persistentShells;
    /**
     * specify where to place new kids (append|prepend)
     *
     * @type {string}
     */
    place;
    /**
     * @type {string}
     */
    shellTemplate;

    /**
     * @param {ChildrenShellsViewOptions} options
     * @param {ChildShellTemplateOptions} options.restOfOptions
     */
    constructor({
                    componentId,
                    elemIdOrJQuery,
                    newGuestsGoLast,
                    persistentShells,
                    ...restOfOptions
                }) {
        super();
        this.parentId = componentId;
        this.$containerElem = jQueryOf(elemIdOrJQuery);
        this.place = newGuestsGoLast ? "append" : "prepend";
        this.persistentShells = persistentShells ?? shellTemplateOptionsAreEmpty(restOfOptions);
        this.shellTemplate = shellTemplateOf(componentId, restOfOptions);
    }

    /**
     * @param {PartName} partName
     */
    create(partName) {
        const $shell = this._$shellElemOf(partName);
        if ($shell) {
            return $shell;
        }
        isFalse(this.persistentShells,
            `Can't have persistent shells while also a shell template!\nMake sure to have ${dataOwnerSelectorOf(partName)} on the "${partName}" persistent shell!`);
        const viewValues = {
            [GlobalConfig.PART]: partName,
            [GlobalConfig.OWNER]: this.parentId,
            [GlobalConfig.COMPONENT_ID]: uniqueId(),
        };
        const kidSeat = generateHtml(this.shellTemplate, viewValues);
        this.$containerElem[this.place](kidSeat);
        return this._$shellElemOf(partName);
    }

    /**
     * @param {PartName} name
     */
    remove(name) {
        if (!this.persistentShells) {
            this.$containerElem.children(dataPartSelectorOf(name)).remove();
        }
    }

    /**
     * @param {*} values
     */
    replace(values) {
        // do nothing
    }

    /**
     * @param {string} partName
     * @return {jQuery<HTMLElement>|undefined}
     * @protected
     */
    _$shellElemOf(partName) {
        if (this.persistentShells) {
            const $childByPartName = this._$shellByPartName(partName);
            return $childByPartName ? $childByPartName : this._$shellByOwnerAndPartName(partName);
        } else {
            return this._$shellByPartName(partName);
        }
    }

    /**
     * @param {string} partName
     * @return {jQuery<HTMLElement>|undefined}
     * @protected
     */
    _$shellByOwnerAndPartName(partName) {
        const byOwnerAndPartNameSelector = `${dataOwnerSelectorOf(this.parentId)}${dataPartSelectorOf(partName)}`
        return this._elemForSelector(byOwnerAndPartNameSelector, "find");
    }

    /**
     * @param {string} partName
     * @return {jQuery<HTMLElement>|undefined}
     * @protected
     */
    _$shellByPartName(partName) {
        const childByPartNameSelector = dataPartSelectorOf(partName);
        return this._elemForSelector(childByPartNameSelector, "children");
    }

    /**
     * @param {string} selector
     * @param {"children" | "find"} searchWith
     * @return {jQuery<HTMLElement>|undefined}
     * @protected
     */
    _elemForSelector(selector, searchWith) {
        const $child = this.$containerElem[searchWith](selector);
        isFalse($child.length > 1, `Found ${$child.length} of ${selector}!`);
        return $child.length ? $child : undefined;
    }
}