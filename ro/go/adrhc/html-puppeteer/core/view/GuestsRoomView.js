import AbstractView from "./AbstractView.js";
import {$guestsRoomOf} from "../Puppeteer.js";
import {dataAttributesOf, jQueryOf, templateTextOf} from "../../util/DomUtils.js";
import GlobalConfig, {dataPart, dataPartSelectorOf, dataType, dataOwnerOf} from "../../util/GlobalConfig.js";
import {generateHtml} from "../../util/HtmlGenerator.js";

/**
 * @typedef {Bag} ChildSeatAttributes
 * @property {string=} templateId is used by child's component to populate its space (aka seat)
 * @property {string=} componentType
 * @property {string=} htmlTag
 */
/**
 * @typedef {Object} GuestsRoomViewOptions
 * @property {string=} componentId
 * @property {string|jQuery<HTMLElement>=} elemIdOrJQuery is the parent's element id or jQuery<HTMLElement>
 * @property {string=} seatTemplate is the element containing the data-type and data-part
 * @property {string=} seatTemplateId
 * @property {string=} childTemplateId is a shortcut for ChildSeatAttributes.templateId
 * @property {boolean=} newGuestsGoLast
 * @property {boolean=} dontRemoveGuests
 * @property {ChildSeatAttributes=} childSeatAttributes
 */
/**
 * @extends {AbstractView}
 */
export default class GuestsRoomView extends AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $guestsRoom;
    /**
     * @type {jQuery<HTMLElement>}
     */
    $componentElem;
    /**
     * it's the child seat template id
     *
     * @type {string}
     */
    componentId;
    /**
     * @type {boolean}
     */
    dontRemoveGuests;
    /**
     * @type {string}
     */
    seatTemplate;
    /**
     * specify where to place new kids (append|prepend)
     *
     * @type {string}
     */
    place;

    /**
     * @param {GuestsRoomViewOptions} options
     */
    constructor({
                    componentId,
                    elemIdOrJQuery,
                    seatTemplate,
                    seatTemplateId,
                    childTemplateId,
                    newGuestsGoLast,
                    dontRemoveGuests,
                    childSeatAttributes = {templateId: childTemplateId},
                }) {
        super();
        this.$componentElem = jQueryOf(elemIdOrJQuery);
        this.componentId = componentId;
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
     */
    create(partName) {
        if (this._childSeatExists(partName)) {
            return;
        }
        const kidSeat = generateHtml(this.seatTemplate, {partName, [GlobalConfig.OWNER_ATTR]: this.componentId});
        this.$guestsRoom[this.place](kidSeat);
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
     * @param {PartName} name
     * @return {jQuery<HTMLElement>}
     * @protected
     */
    _$childSeatByName(name) {
        return this.$guestsRoom.children(dataPartSelectorOf(name));
    }

    /**
     * @param {string=} seatTemplateId
     * @param {ChildSeatAttributes=} childSeatAttributes
     * @protected
     */
    _createSeatTemplate(seatTemplateId, childSeatAttributes) {
        if (seatTemplateId) {
            return templateTextOf(seatTemplateId);
        } else {
            return this._seatTemplateFromChildSeatAttributes(childSeatAttributes);
        }
    }

    /**
     * @param {ChildSeatAttributes=} childSeatAttributes
     * @return {string}
     * @protected
     */
    _seatTemplateFromChildSeatAttributes({templateId, htmlTag = "div", componentType = "simple", ...rest}) {
        // {{this}} will be the part name when the kid's seat will be created
        return `<${htmlTag} ${dataOwnerOf(this.componentId)} ${dataPart()}="{{partName}}" ${dataType()}="${componentType}" data-template-id="${templateId}" ${dataAttributesOf(rest)}></${htmlTag}>`;
    }
}