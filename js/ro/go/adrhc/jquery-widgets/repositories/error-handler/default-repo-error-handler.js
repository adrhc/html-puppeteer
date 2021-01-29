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
            if (typeof jqXHR === "string") {
                // do nothing
            } else if (jqXHR instanceof SimpleError) {
                throw jqXHR;
            } else if (jqXHR.responseText) {
                error = this._simpleErrorOf(jqXHR.responseText, requestType, data);
            }
            throw error ? error : new SimpleError(this.messages[requestType], requestType, data);
        });
    }

    _simpleErrorOf(text, requestType, data) {
        try {
            const problems = ServerError.parse(JSON.parse(text));
            if ($.isArray(problems)) {
                return new SimpleError(this.messages[requestType], requestType, data, problems);
            } else {
                return new SimpleError(this.messages[requestType], requestType, data, [problems]);
            }
        } catch (ex) {
            console.error(`${this.constructor.name}.parseSimpleErrors exception:\n`, ex);
            console.error(`${this.constructor.name}.parseSimpleErrors, JSON.parse error for text:\n`, text);
        }
        return undefined;
    }

    _logPromiseCatch(jqXHR, textStatus, errorThrown) {
        console.log(`${this.constructor.name}, textStatus = ${textStatus}`);
        if (typeof jqXHR === "string") {
            console.error(`${this.constructor.name}.catch (jqXHR is string):\n${jqXHR}`);
        } else if (jqXHR instanceof SimpleError) {
            console.error(`${this.constructor.name}.catch (jqXHR is SimpleError):\n`, jqXHR);
        } else if (jqXHR.responseText) {
            console.log(`${this.constructor.name}.catch responseText:\n${jqXHR.responseText}`);
        }
        if (errorThrown) {
            console.log(`${this.constructor.name}.catch errorThrown:\n`, errorThrown);
        }
    }
}