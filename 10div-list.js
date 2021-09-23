import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateString} from "./ro/go/adrhc/app/Generators.js";
import {namedBtn} from "./ro/go/adrhc/html-puppeteer/util/SelectorUtils.js";
import {getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";

class App {
    /**
     * @type {number}
     */
    index = 1;
    /**
     * @type {number}
     */
    lastRemoved = 0;
    /**
     * @type {SimpleContainerComponent}
     */
    parent;

    constructor(parent) {
        this.parent = parent;
    }

    run() {
        $(namedBtn("change-parent-state")).on("click", () => {
            this.parent.replaceState(JSON.parse($("#parent-debugger").val()));
            $('textarea').height(0);
            $('textarea').height(getTotalHeight);
        });
        $(namedBtn("create")).on("click", () => {
            this.parent.replacePart(`kid${this.index}`,
                {id: this.index++, name: generateString("name ")});
            $('textarea').height(getTotalHeight);
        });
        $(namedBtn("remove")).on("click", () => {
            if (this.lastRemoved === this.index) {
                return;
            }
            this.parent.replacePart(`kid${this.lastRemoved++}`);
            $('textarea').height(0);
            $('textarea').height(getTotalHeight);
        });
        $('textarea').height(getTotalHeight);
        $('textarea').on('input', function () {
            this.style.height = "";
            this.style.height = this.scrollHeight + "px";
        });
    }
}

$(() => {
    // the puppeteer
    const component = animate(withDebugger({debuggerElemIdOrJQuery: "parent-debugger"}));

    // the application using the html-puppeteer
    new App(component).run();
});