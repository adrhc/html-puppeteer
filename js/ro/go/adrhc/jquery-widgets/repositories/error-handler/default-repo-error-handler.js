class DefaultRepoErrorHandler extends RepoErrorHandler {
    constructor(messages = {
        findAll: "Nu s-au putut încărca datele!",
        update: "Actualizarea datelor a eșuat!",
        insert: "Salvarea datelor a eșuat!",
        delete: "Ștergerea nu a reușit!",
        getById: "Nu s-au putut încărca datele!"
    }) {
        super();
        this.messages = messages;
    }

    /**
     * @param promise {Promise}
     * @param operation {string}
     * @param [data] {*}
     * @return {Promise}
     * @protected
     */
    catch(promise, operation, data) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            this._logPromiseCatch(jqXHR, textStatus, errorThrown);
            let error;
            if (jqXHR.responseText) {
                try {
                    error = $.extend(true, new RepositoryError(), JSON.parse(jqXHR.responseText));
                    if (error.data == null) {
                        error.data = data;
                    }
                } catch (ex) {
                    // do nothing
                }
            }
            throw error ? error : new RepositoryError(this.messages[operation], data);
        });
    }

    _logPromiseCatch(jqXHR, textStatus, errorThrown) {
        console.log(`${this.constructor.name}, textStatus = ${textStatus}`);
        if (jqXHR.responseText) {
            console.log(`responseText:\n${jqXHR.responseText}`);
        }
        if (errorThrown) {
            console.log(`errorThrown:\n${errorThrown}`);
        }
    }
}