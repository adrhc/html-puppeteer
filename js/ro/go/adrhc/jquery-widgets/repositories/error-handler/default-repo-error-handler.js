class DefaultRepoErrorHandler extends RepoErrorHandler {
    constructor(messages = {
        findAll: "Nu s-au putut încărca datele!",
        update: "Actualizarea datelor a eşuat!",
        insert: "Salvarea datelor a eşuat!",
        delete: "Ştergerea nu a reuşit!",
        getById: "Nu s-au putut încărca datele!"
    }) {
        super();
        this.messages = messages;
    }

    /**
     * @param promise {Promise}
     * @param requestType {string}
     * @param [data] {*}
     * @return {Promise}
     * @protected
     */
    catch(promise, requestType, data) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            this._logPromiseCatch(jqXHR, textStatus, errorThrown);
            let error;
            if (jqXHR.responseText) {
                try {
                    const problems = ServerError.parse(JSON.parse(jqXHR.responseText));
                    if ($.isArray(problems)) {
                        error = new SimpleError(this.messages[requestType], requestType, data, problems);
                    } else {
                        error = new SimpleError(this.messages[requestType], requestType, data, [problems]);
                    }
                } catch (ex) {
                    console.log(`error parsing as json:\n${jqXHR.responseText}`);
                }
            }
            if (typeof jqXHR === "string") {
                console.log(`${this.constructor.name}.catch (jqXHR is string):\n${jqXHR}`);
            }
            throw error ? error : new SimpleError(this.messages[requestType], requestType, data);
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