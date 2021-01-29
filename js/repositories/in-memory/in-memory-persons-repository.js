class InMemoryPersonsRepository extends InMemoryCrudRepository {
    /**
     * @param item {Person}
     * @param [dontUsePromise] {boolean}
     * @return {Promise<Person>|Person}
     */
    insert(item, dontUsePromise) {
        if (item.firstName === "error") {
            return Promise.reject(new SimpleError("Salvarea datelor a eşuat!", "insert", item));
        }
        return super.insert(item, dontUsePromise);
    }

    /**
     * @param item {Person}
     * @return {Promise<Person>}
     */
    update(item) {
        if (item.firstName === "error") {
            return Promise.reject(new SimpleError("Actualizarea datelor a eşuat!", "update", item));
        }
        return super.update(item);
    }
}