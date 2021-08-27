/**
 * EditableListState extends SelectableListState extends CrudListState extends SimpleListState extends TaggingStateHolder extends StateHolder
 *
 * @template E
 * @extends {EditableListState<E>}
 */
class CatsListState extends EditableListState {
    switchTo(id, context) {
        // cancel switching
        return false;
    }

    switchToOff() {
        // cancel switch off
        return false;
    }
}