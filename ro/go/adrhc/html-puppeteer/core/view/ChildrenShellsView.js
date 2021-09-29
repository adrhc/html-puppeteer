import AbstractView from "./AbstractView.js";
import {jQueryOf} from "../../util/DomUtils.js";
import GlobalConfig from "../../util/GlobalConfig.js";
import {dataPartSelectorOf} from "../../util/SelectorUtils.js";
import {generateHtml} from "../../util/HtmlGenerator.js";
import {uniqueId} from "../../util/StringUtils.js";
import shellTemplateOf from "./ChildShellTemplate.js";

/**
 * @typedef {Bag} SeatAttributes
 * @property {string=} templateId is used by child's component to populate its space (aka shell)
 * @property {string=} componentType
 * @property {string=} htmlTag
 */
/**
 * @typedef {ChildShellTemplateOptions} GuestsRoomViewOptions
 * @property {string} componentId
 * @property {string|jQuery<HTMLElement>=} elemIdOrJQuery is the parent's element id or jQuery<HTMLElement>
 * @property {boolean=} newGuestsGoLast
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
     * @param {GuestsRoomViewOptions} options
     * @param {ChildShellTemplateOptions} options.restOfOptions
     */
    constructor({
                    componentId,
                    elemIdOrJQuery,
                    newGuestsGoLast,
                    ...restOfOptions
                }) {
        super();
        this.parentId = componentId;
        this.$containerElem = jQueryOf(elemIdOrJQuery);
        this.place = (newGuestsGoLast ?? false) ? "append" : "prepend";
        this.shellTemplate = shellTemplateOf(componentId, restOfOptions);
    }

    /**
     * @param {PartName} partName
     */
    create(partName) {
        if (this._childSeatExists(partName)) {
            return;
        }
        const viewValues = {
            [GlobalConfig.PART]: partName,
            [GlobalConfig.OWNER]: this.parentId,
            [GlobalConfig.COMPONENT_ID]: uniqueId(),
        };
        const kidSeat = generateHtml(this.shellTemplate, viewValues);
        this.$containerElem[this.place](kidSeat);
    }

    /**
     * @param {PartName} name
     */
    remove(name) {
        this.$containerElem.children(dataPartSelectorOf(name)).remove();
    }

    /**
     * @param {string} partName
     * @return {boolean}
     * @protected
     */
    _childSeatExists(partName) {
        return !!this.$containerElem.children(dataPartSelectorOf(name)).length;
    }
}