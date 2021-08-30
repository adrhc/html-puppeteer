class CreateStateChange extends TaggedStateChange {
    constructor(stateOrPart, newPartName) {
        super(CUDTags.CREATE, undefined, stateOrPart, undefined, newPartName);
    }
}