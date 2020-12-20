class AbstractComponent {
    /**
     * (internal) errors handler
     *
     * @param promise
     * @return {Promise<any>}
     * @protected
     */
    handleRepoErrors(promise) {
        return promise.catch((jqXHR, textStatus, errorThrown) => {
            console.log(textStatus, errorThrown);
            alert(`${textStatus}\n${jqXHR.responseText}`);
            throw textStatus;
        });
    }

    /**
     * @return {Promise<StateChange|undefined>}
     */
    init() {
        return Promise.resolve(undefined);
    }

    /**
     * @param events {string,string[]}
     * @return {string|*}
     */
    withNamespaceFor(events) {
        if ($.isArray(events)) {
            return events.map(ev => this.withNamespaceFor(ev)).join(" ");
        } else {
            return `${events}${this.eventsNamespace}`;
        }
    }

    get eventsNamespace() {
        return `.${this.constructor.name}.${this.owner}`;
    }

    get owner() {
        throw "Not implemented!";
    }
}