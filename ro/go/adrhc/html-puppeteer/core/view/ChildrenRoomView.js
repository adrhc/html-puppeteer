import AbstractView from "./AbstractView.js";
import {$childrenRoomOf} from "../Puppeteer.js";
import {dataAttributesOf, templateTextOf} from "../../util/HtmlUtils.js";
import {dataPart, dataPartSelectorOf, dataType} from "../../util/GlobalConfig.js";
import {generateHtml} from "../../util/HtmlGenerator.js";

/**
 * @typedef {Bag} ChildFrameAttributes
 * @property {string=} templateId is used by child's component to populate its space (aka frame)
 * @property {string=} componentType
 * @property {string=} htmlTag
 */
/**
 * @typedef {Object} ChildrenRoomViewOptions
 * @property {string=} parentIdOrJQuery
 * @property {string=} frameTemplate is the element containing the data-type and data-part
 * @property {string=} frameTemplateId
 * @property {boolean=} newChildrenGoLast
 * @property {boolean=} dontRemoveChildren
 * @property {ChildFrameAttributes=} childFrameAttributes
 */
/**
 * @extends {AbstractView}
 */
export default class ChildrenRoomView extends AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     */
    $childrenRoom;
    /**
     * @type {boolean}
     */
    dontRemoveChildren;
    /**
     * @type {string}
     */
    frameTemplate;
    /**
     * @type {string|jQuery<HTMLElement>}
     */
    parentIdOrJQuery;
    /**
     * specify where to place new kids (append|prepend)
     *
     * @type {string}
     */
    place;

    /**
     * @param {ChildrenRoomViewOptions} options
     */
    constructor({
                    elemIdOrJQuery,
                    frameTemplate,
                    frameTemplateId,
                    newChildrenGoLast,
                    dontRemoveChildren,
                    childFrameAttributes = {},
                }) {
        super();
        this.parentIdOrJQuery = elemIdOrJQuery;
        this.place = (newChildrenGoLast ?? false) ? "append" : "prepend";
        this.dontRemoveChildren = dontRemoveChildren ?? false;
        this.frameTemplate = frameTemplate ?? this._createTemplate(frameTemplateId, childFrameAttributes);
    }

    /**
     * Announce that parent updated its view.
     */
    parentUpdated() {
        this.$childrenRoom = $childrenRoomOf(this.parentIdOrJQuery);
    }

    /**
     * @param {PartName} name
     */
    create(name) {
        if (this._childFrameExists(name)) {
            return;
        }
        const kidHtmlContent = generateHtml(this.frameTemplate, name);
        this.$childrenRoom[this.place](kidHtmlContent);
    }

    /**
     * @param {PartName} name
     */
    remove(name) {
        this.$childrenRoom.children(dataPartSelectorOf(name)).remove();
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
        return this.$childrenRoom.children(dataPartSelectorOf(name));
    }

    /**
     * @param {string=} frameTemplateId
     * @param {ChildFrameAttributes=} childFrameAttributes
     * @protected
     */
    _createTemplate(frameTemplateId, childFrameAttributes) {
        if (frameTemplateId) {
            return templateTextOf(frameTemplateId);
        } else {
            return this._templateFromChildFrameAttributes(childFrameAttributes);
        }
    }

    /**
     * @param {ChildFrameAttributes=} childFrameAttributes
     * @return {string}
     * @protected
     */
    _templateFromChildFrameAttributes({templateId, htmlTag = "div", componentType = "simple", ...rest}) {
        // {{this}} will be the part name when the kid's frame will be created
        return `<${htmlTag} ${dataPart()}="{{this}}" ${dataType()}="${componentType}" data-template-id="${templateId}" ${dataAttributesOf(rest)}></${htmlTag}>`;
    }
}