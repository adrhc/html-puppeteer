/**
 * SimpleListState extends TaggingStateHolder extends StateHolder
 *
 * @template TItem
 * @typedef {TItem} T
 * @typedef {TItem} P
 * @extends {TaggingStateHolder<TItem[], TItem>}
 */
class SimpleListState extends TaggingStateHolder {
    /**
     * https://jsdoc.app/tags-param.html#optional-parameters-and-default-values
     *
     * @param {TItem[]} [items=[]]
     */
    replaceAll(items = []) {
        super.replace(items);
    }

    /**
     * @return {TItem[]}
     */
    get items() {
        return this.currentState;
    }

    /**
     * @param {TItem[]} items
     */
    set items(items) {
        this.currentState = items;
    }
}