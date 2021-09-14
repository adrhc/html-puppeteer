import PartialStateChangesHandler from "./PartialStateChangesHandler";

export default class PartsAllocator extends PartialStateChangesHandler {
    /**
     * @type {{[string]: AbstractComponent}}
     */
    parts;
}