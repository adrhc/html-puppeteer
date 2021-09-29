import AbstractView from "./AbstractView.js";
import {contentOfElemId, dataAttributesOf, jQueryOf} from "../../util/DomUtils.js";
import GlobalConfig, {dataComponentIdOf, dataOwnerOf, dataPartOf, dataTypeOf} from "../../util/GlobalConfig.js";
import {dataPartSelectorOf} from "../../util/SelectorUtils.js";
import {generateHtml} from "../../util/HtmlGenerator.js";
import {uniqueId} from "../../util/StringUtils.js";

/**
 * @typedef {Bag} SeatAttributes
 * @property {string=} templateId is used by child's component to populate its space (aka seat)
 * @property {string=} componentType
 * @property {string=} htmlTag
 */
/**
 * @typedef {Object} GuestsRoomViewOptions
 * @property {string} componentId
 * @property {string|jQuery<HTMLElement>=} elemIdOrJQuery is the parent's element id or jQuery<HTMLElement>
 * @property {string=} seatTemplate is the seat's HTML containing the data-type and data-part
 * @property {string=} seatTemplateId
 * @property {string=} seatOccupantTemplateId is a shortcut for SeatAttributes.templateId
 * @property {string=} seatOccupantHtmlTag is a shortcut for SeatAttributes.htmlTag
 * @property {boolean=} newGuestsGoLast
 * @property {boolean=} dontRemoveGuests
 * @property {SeatAttributes=} childSeatAttributes
 */
/**
 * @extends {AbstractView}
 */
export default class GuestsRoomView extends AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $containerElem;
    /**
     * it's the child seat template id
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
    seatTemplate;

    /**
     * @param {GuestsRoomViewOptions} options
     */
    constructor({
                    componentId,
                    elemIdOrJQuery,
                    newGuestsGoLast,
                    seatTemplate,
                    seatTemplateId,
                    seatOccupantTemplateId,
                    seatOccupantHtmlTag,
                    childSeatAttributes = {templateId: seatOccupantTemplateId, htmlTag: seatOccupantHtmlTag}
                }) {
        super();
        this.parentId = componentId;
        this.$containerElem = jQueryOf(elemIdOrJQuery);
        this.place = (newGuestsGoLast ?? false) ? "append" : "prepend";
        this.seatTemplate = seatTemplate ?? this._createSeatTemplate(seatTemplateId, childSeatAttributes);
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
        const kidSeat = generateHtml(this.seatTemplate, viewValues);
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

    /**
     * @param {string=} seatTemplateId
     * @param {SeatAttributes=} childSeatAttributes
     * @protected
     */
    _createSeatTemplate(seatTemplateId, childSeatAttributes) {
        if (seatTemplateId) {
            return contentOfElemId(seatTemplateId);
        } else {
            return this._templateFromSeatAttributes(childSeatAttributes);
        }
    }

    /**
     * @param {SeatAttributes=} childSeatAttributes
     * @return {string}
     * @protected
     */
    _templateFromSeatAttributes({templateId, htmlTag = "div", componentType = "simple", ...rest}) {
        return `<${htmlTag} ${dataTypeOf(componentType)} ${dataOwnerOf(this.parentId)} ${dataPartOf(`{{${GlobalConfig.PART}}}`)} ${dataComponentIdOf(`{{${GlobalConfig.COMPONENT_ID}}}`)} data-template-id="${templateId}" ${dataAttributesOf(rest)}></${htmlTag}>`;
    }
}