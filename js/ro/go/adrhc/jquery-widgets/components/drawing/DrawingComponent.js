class DrawingComponent extends ContainerComponent {
    processStateChange(stateChangeOrJustData, dontRecordStateEvents) {
        super.reset();
        return super.processStateChange(stateChangeOrJustData, dontRecordStateEvents);
    }
}