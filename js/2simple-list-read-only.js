$(() => {
    const component = new SimpleListComponent({
        elemIdOrJQuery: "dogsTable",
        items: DbMocks.dogsOf(10),
    });
    component.autoInitializationResult
        .then(() => {
            AssertionUtils.isTrue(JSON.stringify(component.state.currentState) === "[{\"id\":0,\"name\":\"dog 0\"},{\"id\":1,\"name\":\"dog 1\"},{\"id\":2,\"name\":\"dog 2\"},{\"id\":3,\"name\":\"dog 3\"},{\"id\":4,\"name\":\"dog 4\"},{\"id\":5,\"name\":\"dog 5\"},{\"id\":6,\"name\":\"dog 6\"},{\"id\":7,\"name\":\"dog 7\"},{\"id\":8,\"name\":\"dog 8\"},{\"id\":9,\"name\":\"dog 9\"}]")
        }).then(() => {
        console.log("FINISHED");
    });
})
