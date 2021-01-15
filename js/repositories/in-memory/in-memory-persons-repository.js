class InMemoryPersonsRepository extends InMemoryCrudRepository {
    constructor(items) {
        super(items, () => new Person());
    }
}