/**
 * @template SCT
 * @interface
 */
export default class StateInitializer {
    /**
     * @param {StateHolder<SCT>} stateHolder
     */
    load(stateHolder) {}
}