class ContainerState extends StateHolder {
    collectStateChange(stateChange, {dontRecordStateEvents, overwriteState = true}) {
        super.collectStateChange(stateChange, {dontRecordStateEvents, overwriteState})
    }
}