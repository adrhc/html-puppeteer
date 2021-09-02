$(() => {
    /**
     * @type {ElasticListComponent}
     */
    const component = JQWUtil.createComponents();
    component.autoInitializationResult
        .then(() => {
            const extractedEntities = component.extractAllEntities();
            AssertionUtils.isTrue(JSON.stringify(extractedEntities) ===
                "[{\"id\":\"1\",\"name\":\"dog1\"},{\"id\":\"2\",\"name\":\"dog2\"},{\"id\":\"3\",\"name\":\"dog3\"}]");
            console.log("FINISHED");
        })
});
