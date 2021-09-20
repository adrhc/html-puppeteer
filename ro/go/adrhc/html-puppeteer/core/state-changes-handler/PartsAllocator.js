import PartialStateChangesHandler from "./PartialStateChangesHandler.js";

/**
 * @implements {PartialStateChangesHandler}
 */
export default class PartsAllocator extends PartialStateChangesHandler {
    /**
     * @type {{[string]: AbstractComponent}}
     */
    parts;
}