$(() => {
    const component = JQWUtil.createComponents();
    component.autoInitializationResult
        .then(() => {
            AssertionUtils.isTrue(JSON.stringify(component.state.currentState) === "[{\"id\":1,\"name\":\"dog1\"},{\"id\":2,\"name\":\"dog2\"},{\"id\":3,\"name\":\"dog3\"}]")
        }).then(() => {
        console.log("FINISHED");
    });
});
