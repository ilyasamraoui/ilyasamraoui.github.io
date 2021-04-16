class Model {
    constructor() {
        this.links = []
    }
}

class View {
    constructor() {
        this.filter = this.getElement('#filter')
        this.links = this.getElement('#links')
    }

    getElement(selector) {
        return document.querySelector(selector)
    }

    createElement(tag, ...classNames) {
        const element = document.createElement(tag)
        if (classNames) {
            element.classList.add(...classNames)
        }
        return element
    }

    bindFilterInputChange(handler) {
        this.filter.addEventListener('input', () => {
            handler(this.filter.value)
        })
    }

    displayLinks(links) {
        while (this.links.firstChild) {
            this.links.removeChild(this.links.firstChild)
        }
        if (links.length === 0) {
            const div = this.createElement('div', "alert", "alert-warning")
            const h5 = this.createElement("h6")
            h5.textContent = 'No Results Found!'
            div.append(h5)
            this.links.append(div)
        } else {
            links.forEach(link => {
                const a = this.createElement("a",
                    "list-group-item", "list-group-item-action", "flex-column", "align-items-start")
                a.href = link.url
                a.target = "_blank"
                const nameDiv = this.createElement("div", "d-flex", "w-100", "justify-content-between")
                const h5 = this.createElement("h5", "text-primary", "h5", "mb-1")
                h5.textContent = link.name
                nameDiv.append(h5)
                a.append(nameDiv)
                const urlDiv = this.createElement("div", "font-size-sm", "text-success", "mb-1")
                urlDiv.textContent = link.url
                a.append(urlDiv)
                this.links.append(a)
            })
        }
    }
}

class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view
        this.init()
    }

    init = async function () {
        const url = "https://raw.githubusercontent.com/ilyasamraoui/ilyasamraoui.github.io/main/links.yml"
        this.model.links = await this.fetchLinks(url)
        this.view.displayLinks(this.model.links)
        this.view.bindFilterInputChange(this.handleFilterInputChange)
    }

    fetchLinks = async (url) => {
        const response = await fetch(url)
        const blob = await response.blob()
        const yaml = await blob.text()
        return jsyaml.load(yaml).links
    }

    handleFilterInputChange = (filter) => {
        this.view.displayLinks(
            this.model.links.filter(link => link.name.toLowerCase().includes(filter.toLowerCase()))
        )
    }
}

const app = new Controller(new Model(), new View())
