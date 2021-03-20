/**
 * todo: adapt to AbstractView usage
 */
class DynamicSelectOneView extends AbstractView {
    /**
     * @type {CachedHtmlTemplate}
     */
    tmpl;

    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param tmplUrl {string}
     */
    constructor(elemIdOrJQuery, {tmplUrl}) {
        super();
        this._setupElem(elemIdOrJQuery);
        this._setupOwner();
        this._setupCachedUrl(tmplUrl);
    }

    _setupCachedUrl(dynaSelOneHtml = "js/ro/go/adrhc/jquery-widgets/components/dynamic-select-one/templates/dyna-sel-one.html") {
        this.tmpl = new CachedHtmlTemplate({url: JQueryWidgetsConfig.urlOf(dynaSelOneHtml)});
    }

    /**
     * @param data {DynaSelOneState}
     * @param [focusOnSearchInput] {boolean}
     * @return {Promise<jQuery>}
     */
    update(data, focusOnSearchInput) {
        if (typeof data === "object" && data instanceof StateChange) {
            data = data.data;
        }
        const viewModel = this._viewModelOf(data);
        return this._renderView(viewModel)
            .then(() => {
                this._applyCss(viewModel);
                if (focusOnSearchInput) {
                    HtmlUtils.focus(this.$titleElem);
                }
                return viewModel;
            });
    }

    /**
     * @param viewModel {Object}
     * @return {Promise<jQuery>}
     */
    _renderView(viewModel) {
        return this.tmpl.cached
            .then(html => Mustache.render(html, viewModel))
            .then(html => this.$elem.html(html.trim()));
    }

    /**
     * @param viewModel {Object}
     */
    _applyCss(viewModel) {
        CssUtils.switchClasses([
            {$elem: this.$titleElem, classes: "found", remove: !viewModel.found},
            {$elem: this.$selectionInfoElem, classes: "removed", remove: viewModel.found},
            {$elem: this.$optionsElem, classes: "removed", remove: viewModel.options},
            {$elem: this.$nothingFound, classes: "removed", remove: viewModel.nothingFound},
            {$elem: this.$tooMany, classes: "removed", remove: viewModel.tooMany},
            {$elem: this.$tooLessChars1, classes: "removed", remove: viewModel.minCharsToSearch},
            {$elem: this.$tooLessChars2, classes: "removed", remove: viewModel.minCharsToSearch === 0}
        ]);
    }

    /**
     * @param state {DynaSelOneState}
     * @return {{}}
     * @private
     */
    _viewModelOf(state) {
        const viewModel = {
            owner: this.owner,
            titleInputName: this.titleInputName,
            valueInputName: this.valueInputName,
            descriptionInputName: this.descriptionInputName,
            title: state.title,
            placeholder: this.placeholder,
            // 2: used to have the multiple select which know to handle click event on options
            optionsToShow: Math.min(Math.max(state.optionsLength, 2), this.optionsToShow)
        };
        if (state.selectedItem) {
            // search success: selected/found exactly 1 item
            viewModel.description = state.selectedItem.description;
            viewModel.id = state.selectedItem.id;
            viewModel.found = true;
        } else if (state.repositoryWasSearched && state.isEnoughTextToSearch(state.title)) {
            viewModel.searchedDetails = state.title ? `s-a căutat <i>${state.title}</i>` : "s-a căutat întreg setul de date";
            if (state.optionsLength > 1) {
                // too many results
                viewModel.tooMany = true;
            } else if (state.optionsLength === 0) {
                // no search result
                viewModel.nothingFound = true;
            }
        } else {
            // search with too less characters
            viewModel.minCharsToSearch = state.minCharsToSearch;
        }
        if (state.optionsLength > 1 || state.optionsLength === 1 && !state.selectedItem) {
            // rendering options
            viewModel.options = state.options.map(o => {
                const option = new DynaSelOneOption(o.id, o.optionText);
                if (state.selectedItem && o.id === state.selectedItem.id) {
                    option.selected = "selected";
                }
                return option;
            });
        }
        return viewModel;
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $tooLessChars1() {
        return this.$elem.find(`[data-name='too-less-chars1']`);
    }

    get $tooLessChars2() {
        return this.$elem.find(`[data-name='too-less-chars2']`);
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $nothingFound() {
        return this.$elem.find(`[data-name='nothing-found']`);
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $tooMany() {
        return this.$elem.find(`[data-name='too-many']`);
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $selectionInfoElem() {
        return this.$elem.find(`[data-name='selection-info']`);
    }

    /**
     * @returns {jQuery<HTMLSelectElement>}
     */
    get $optionsElem() {
        return this.$elem.find(`[name='options']`);
    }

    /**
     * this is the search box
     *
     * @return {jQuery<HTMLInputElement>}
     */
    get $titleElem() {
        return this.$elem.find(`[name='${this.titleInputName}']`);
    }

    get titleInputName() {
        return this.$elem.data("name");
    }

    get placeholder() {
        return this.$elem.data("placeholder");
    }

    get optionsToShow() {
        const optionsToShow = this.$elem.data("options-to-show");
        return optionsToShow ? +optionsToShow : 5;
    }

    get valueInputName() {
        const inputName = this.$elem.data("value");
        return inputName ? inputName : `${this.titleInputName}-value`;
    }

    get descriptionInputName() {
        const inputName = this.$elem.data("description");
        return inputName ? inputName : `${this.titleInputName}-description`;
    }
}