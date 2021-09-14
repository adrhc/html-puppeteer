import PartialStateChangesHandler from "./PartialStateChangesHandler.js";

export default class PartsAllocator extends PartialStateChangesHandler {
    /**
     * @type {{[string]: AbstractComponent}}
     */
    parts;
}