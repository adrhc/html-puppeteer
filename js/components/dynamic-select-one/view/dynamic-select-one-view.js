class DynamicSelectOneView {
    constructor(elemId, tmplId, {placeholder, optionsToShow = 10}) {
        this.elemId = elemId;
        this.tmplId = tmplId;
        this.placeholder = placeholder;
        this.optionsToShow = optionsToShow;
    }

    init(data) {
        this.updateView(data, true);
    }

    /**
     * @param data {DynamicSelectOneState}
     * @param focusOnSearchInput
     */
    updateView(data, focusOnSearchInput) {
        this._clearOnBlurHandlers();
        const viewModel = this._viewModelOf(data);
        this._renderView(viewModel)
        this._applyCss(viewModel);
        if (focusOnSearchInput) {
            this._focusOnSearchInput();
        }
    }

    /**
     * @param viewModel {Object}
     */
    _renderView(viewModel) {
        const html = Mustache.render(this.$tmplHtml, viewModel);
        this.$componentElem.html(html.trim());
    }

    /**
     * @param viewModel {Object}
     */
    _applyCss(viewModel) {
        if (viewModel.options) {
            this.$selectElem.removeClass("removed");
            this.$descriptionElem.addClass("removed");
        } else {
            this.$selectElem.addClass("removed");
            this.$descriptionElem.removeClass("removed");
        }
    }

    _clearOnBlurHandlers() {
        this.$componentElem.off("blur.dyna-sel-one");
        const $searchInputElem = this.$searchInputElem;
        if ($searchInputElem.length) {
            $searchInputElem[0].onblur = null;
        }
    }

    _focusOnSearchInput() {
        const searchInput = this.$searchInputElem;
        const value = searchInput.val();
        searchInput.focus().val("").val(value);
    }

    /**
     * @param state {DynamicSelectOneState}
     */
    _viewModelOf(state) {
        const viewModel = {
            title: state.title,
            placeholder: this.placeholder,
            optionsToShow: Math.min(state.optionsLength, this.optionsToShow)
        };
        if (state.selectedItem) {
            // showing selected item
            viewModel.description = state.selectedItem.description;
        } else if (state.isEnoughTextToSearch(state.title)) {
            // no item selected, showing empty search result
            viewModel.description = `Nu s-a găsit nimic deocamdată! s-a cautat <i>${state.title}</i>`;
        } else {
            // no item selected, showing char number required for searching
            viewModel.description = `Completați cel puțin ${state.minCharsToSearch} caractere pt a căuta (apasând ENTER).`;
        }
        if (state.optionsLength > 1 || viewModel.optionsToShow === 1 && !state.selectedItem) {
            // rendering options
            viewModel.options = state.options.map(o => {
                const option = {id: o.id, description: o.description, selected: ""};
                if (state.selectedItem && o.id === state.selectedItem.id) {
                    option.selected = "selected";
                }
                return option;
            });
        }
        return viewModel;
    }

    get $tmplHtml() {
        return $(`#${this.tmplId}`).html();
    }

    get $descriptionElem() {
        return $(`#${this.elemId} .dyna-sel-one-description`);
    }

    get $selectElem() {
        return $(`#${this.elemId} [name='options']`);
    }

    get $searchInputElem() {
        return $(`#${this.elemId} [name='title']`);
    }

    get $componentElem() {
        return $(`#${this.elemId}`);
    }
}