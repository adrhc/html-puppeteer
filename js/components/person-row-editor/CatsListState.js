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