import {withDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateCats} from "./ro/go/adrhc/app/Generators.js";
import {$btnOf, btnSelectorOf} from "./ro/go/adrhc/html-puppeteer/util/SelectorUtils.js";
import {activate, deactivate, getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";

class App {
    /**
     * @type {BasicContainerComponent}
     */
    parent;

    constructor(parent) {
        this.parent = parent;
    }

    run() {
        $(btnSelectorOf("generate-message1")).on("click", () => {
            this.parent.replacePart("message1", new Date().toISOString());
            $('textarea').height(0);
            $('textarea').height(getTotalHeight);
        });
        $(btnSelectorOf("change-parent-state")).on("click", () => {
            this.parent.replaceState(JSON.parse($("#main-debugger").val()));
            $('textarea').height(0);
            $('textarea').height(getTotalHeight);
        });
        $(btnSelectorOf("create")).on("click", () => {
            this.parent.replacePart("cats", generateCats(1));
            deactivate($btnOf("create"));
            activate($btnOf("remove"));
            $('textarea').height(getTotalHeight);
        });
        $(btnSelectorOf("remove")).on("click", () => {
            this.parent.replacePart("cats");
            deactivate($btnOf("remove"));
            activate($btnOf("create"));
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
    const component = animate(withDebugger({debuggerElemIdOrJQuery: "main-debugger"}));

    // the application using the html-puppeteer
    new App(component).run();
});