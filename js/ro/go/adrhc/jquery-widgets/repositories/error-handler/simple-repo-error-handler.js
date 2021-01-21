class SimpleRepoErrorHandler extends RepoErrorHandler {
    /**
     * @type {string}
     */
    message;

    constructor(message) {
        super();
        this.message = message;
    }

    catch(promise, operation, data) {
        return promise.catch(() => alert(this.message));
    }
}