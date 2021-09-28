import AbstractView from "./AbstractView.js";
import {$guestsRoomOf} from "../Puppeteer.js";
import {contentOfElemId, dataAttributesOf, jQueryOf} from "../../util/DomUtils.js";
import GlobalConfig, {
    componentIdOf,
    dataComponentIdOf,
    dataOwnerOf,
    dataPartOf,
    dataTypeOf
} from "../../util/GlobalConfig.js";
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
    $componentElem;
    /**
     * @type {jQuery<HTMLElement>}
     */
    $guestsRoom;
    /**
     * @type {boolean}
     */
    dontRemoveGuests;
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
                    seatTemplate,
                    seatTemplateId,
                    seatOccupantTemplateId,
                    seatOccupantHtmlTag,
                    newGuestsGoLast,
                    dontRemoveGuests,
                    childSeatAttributes = {templateId: seatOccupantTemplateId, htmlTag: seatOccupantHtmlTag}
                }) {
        super();
        this.$componentElem = jQueryOf(elemIdOrJQuery);
        this.parentId = componentId;
        this.place = (newGuestsGoLast ?? false) ? "append" : "prepend";
        this.dontRemoveGuests = dontRemoveGuests ?? false;
        this.seatTemplate = seatTemplate ?? this._createSeatTemplate(seatTemplateId, childSeatAttributes);
    }

    /**
     * Announce that parent updated its view.
     */
    parentUpdated() {
        this.$guestsRoom = $guestsRoomOf(this.$componentElem);
    }

    /**
     * @param {PartName} partName
     * @return {Bag} the view's values
     */
    create(partName) {
        const viewValues = {
            [GlobalConfig.PART]: partName,
            [GlobalConfig.OWNER]: this.parentId,
        };
        if (this._childSeatExists(partName)) {
            viewValues[GlobalConfig.COMPONENT_ID] = this._seatIdOf(partName);
            return viewValues;
        }
        viewValues[GlobalConfig.COMPONENT_ID] = uniqueId();
        const kidSeat = generateHtml(this.seatTemplate, viewValues);
        this.$guestsRoom[this.place](kidSeat);
        return viewValues;
    }

    /**
     * @param {PartName} name
     */
    remove(name) {
        this.$guestsRoom.children(dataPartSelectorOf(name)).remove();
    }

    /**
     * @param {string} partName
     * @return {boolean}
     * @protected
     */
    _childSeatExists(partName) {
        return !!this._$childSeatByName(partName).length;
    }

    /**
     * @param {PartName} partName
     * @return {string|undefined}
     * @protected
     */
    _seatIdOf(partName) {
        return componentIdOf(this._$childSeatByName(partName));
    }

    /**
     * @param {PartName} name
     * @return {jQuery<HTMLElement>}
     * @protected
     */
    _$childSeatByName(name) {
        return this.$guestsRoom.children(dataPartSelectorOf(name));
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