/**
 * https://github.com/swarup260/Learning_Algorithms/blob/master/data_structure/Dequeue.js
 */
class Dequeue {
    constructor() {
        this.clear();
    }

    addFront(element) {
        if (this.isEmpty()) {
            this.addBack(element);
        } else if (this.lowestCount > 0) {
            this.lowestCount--;
            this.items[this.lowestCount] = element;
        } else {
            for (let index = this.count; index > 0; index--) {
                this.items[index] = this.items[index - 1];
            }
            this.count++;
            this.items[0] = element;
        }
    }

    addBack(element) {
        this.items[this.count] = element;
        this.count++;
    }

    removeFront() {
        if (this.isEmpty()) {
            return undefined;
        }

        let result = this.items[this.lowestCount];
        delete this.items[this.lowestCount];
        this.lowestCount++;
        return result;

    }

    removeBack() {
        if (this.isEmpty()) {
            return undefined;
        }
        let result = this.items[this.count - 1];
        delete this.items[this.count - 1];
        this.count--;
        return result;
    }

    /**
     * aka peek left
     *
     * @param count {number} how muck further from left to pick; 0 means 1th from left
     * @return {undefined|*}
     */
    peekFront(count = this.lowestCount) {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[count];
    }

    /**
     * aka peek right
     *
     * @param count {number} how muck back from right to pick; 0 means 1th from right
     * @return {undefined|*}
     */
    peekBack(count = 0) {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.count - count - 1];
    }

    /**
     * @param predicate {function(stateChange: StateChange): boolean}
     * @return {undefined|*}
     */
    findFirstFromBack(predicate) {
        let stateChange;
        let i = 0;
        stateChange = this.items[this.count - i++ - 1];
        while (!!stateChange) {
            if (predicate(stateChange)) {
                return stateChange;
            }
            stateChange = this.items[this.count - i++ - 1];
        }
        return undefined;
    }

    /**
     * @param fromNewestToEarliest {boolean|undefined}
     * @return {[]}
     */
    peekAll(fromNewestToEarliest) {
        const items = [];
        for (let i = this.lowestCount; i < this.count; i++) {
            if (fromNewestToEarliest) {
                items.unshift(this.items[i]);
            } else {
                items.push(this.items[i]);
            }
        }
        return items;
    }

    isEmpty() {
        return this.count - this.lowestCount === 0;
    }

    size() {
        return this.count - this.lowestCount;
    }

    clear() {
        this.items = {};
        this.count = 0;
        this.lowestCount = 0;
    }

    toString() {
        if (this.isEmpty()) {
            return "";
        }
        let string = `${this.items[this.lowestCount]}`;
        for (let index = this.lowestCount + 1; index < this.count; index++) {
            string = `${string},${this.items[index]}`;
        }
        return string;
    }
}