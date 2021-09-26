import AbstractView from "./AbstractView.js";
import {$guestsRoomOf} from "../Puppeteer.js";
import {dataAttributesOf, jQueryOf, templateTextOf} from "../../util/DomUtils.js";
import GlobalConfig, {dataPart, dataPartSelectorOf, dataType, dataOwnerOf} from "../../util/GlobalConfig.js";
import {generateHtml} from "../../util/HtmlGenerator.js";

/**
 * @typedef {Bag} ChildFrameAttributes
 * @property {string=} templateId is used by child's component to populate its space (aka frame)
 * @property {string=} componentType
 * @property {string=} htmlTag
 */
/**
 * @typedef {Object} GuestsRoomViewOptions
 * @property {string=} componentId
 * @property {string|jQuery<HTMLElement>=} elemIdOrJQuery is the parent's element id or jQuery<HTMLElement>
 * @property {string=} frameTemplate is the element containing the data-type and data-part
 * @property {string=} frameTemplateId
 * @property {string=} childTemplateId is a shortcut for ChildFrameAttributes.templateId
 * @property {boolean=} newGuestsGoLast
 * @property {boolean=} dontRemoveGuests
 * @property {ChildFrameAttributes=} childFrameAttributes
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
     * it's the child frame template id
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
    frameTemplate;
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
                    frameTemplate,
                    frameTemplateId,
                    childTemplateId,
                    newGuestsGoLast,
                    dontRemoveGuests,
                    childFrameAttributes = {templateId: childTemplateId},
                }) {
        super();
        this.$componentElem = jQueryOf(elemIdOrJQuery);
        this.componentId = componentId;
        this.place = (newGuestsGoLast ?? false) ? "append" : "prepend";
        this.dontRemoveGuests = dontRemoveGuests ?? false;
        this.frameTemplate = frameTemplate ?? this._createFrameTemplate(frameTemplateId, childFrameAttributes);
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
        if (this._childFrameExists(partName)) {
            return;
        }
        const kidFrame = generateHtml(this.frameTemplate, {partName, [GlobalConfig.OWNER_ATTR]: this.componentId});
        this.$guestsRoom[this.place](kidFrame);
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
    _childFrameExists(partName) {
        return !!this._$childFrameByName(partName).length;
    }

    /**
     * @param {PartName} name
     * @return {jQuery<HTMLElement>}
     * @protected
     */
    _$childFrameByName(name) {
        return this.$guestsRoom.children(dataPartSelectorOf(name));
    }

    /**
     * @param {string=} frameTemplateId
     * @param {ChildFrameAttributes=} childFrameAttributes
     * @protected
     */
    _createFrameTemplate(frameTemplateId, childFrameAttributes) {
        if (frameTemplateId) {
            return templateTextOf(frameTemplateId);
        } else {
            return this._frameTemplateFromChildFrameAttributes(childFrameAttributes);
        }
    }

    /**
     * @param {ChildFrameAttributes=} childFrameAttributes
     * @return {string}
     * @protected
     */
    _frameTemplateFromChildFrameAttributes({templateId, htmlTag = "div", componentType = "simple", ...rest}) {
        // {{this}} will be the part name when the kid's frame will be created
        return `<${htmlTag} ${dataOwnerOf(this.componentId)} ${dataPart()}="{{partName}}" ${dataType()}="${componentType}" data-template-id="${templateId}" ${dataAttributesOf(rest)}></${htmlTag}>`;
    }
}