class RowSwappingState extends TaggingStateHolder {
    /**
     * @param {EntityRowSwap} otherEntityRowSwap
     * @return {boolean}
     * @protected
     */
    _currentStateEquals(otherEntityRowSwap) {
        if (this.currentState != null && this.currentState.similarTo(otherEntityRowSwap)) {
            return true;
        }
        return super._currentStateEquals(otherEntityRowSwap);
    }

    switchTo(otherEntityRow) {
        return this.replace(otherEntityRow);
    }

    switchOff() {
        return this.replace();
    }
}