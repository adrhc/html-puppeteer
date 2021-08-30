class DeleteStateChange extends TaggedStateChange {
    constructor(previousStateOrPart, previousPartName) {
        super(CUDTags.DELETE, previousStateOrPart, undefined, previousPartName);
    }
}