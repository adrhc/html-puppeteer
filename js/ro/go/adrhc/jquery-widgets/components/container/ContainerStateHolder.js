class ContainerStateHolder extends StateHolder {
    collectStateChangeOfSelf() {
        const stateChange = new StateChange(undefined, this.currentState);
        return super.collectStateChange(stateChange)
    }
}