class Model {
    constructor() {
        this.links = []
    }
}

class View {
    constructor() {
        this.filter = this.getElement('#filter')
        this.linksResult = this.getElement('#links-result')
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
        while (this.linksResult.firstChild) {
            this.linksResult.removeChild(this.linksResult.firstChild)
        }
        if (links.length === 0) {
            const div = this.createElement('div', "alert", "alert-warning")
            const h5 = this.createElement("h6")
            h5.textContent = 'No Results Found!'
            div.append(h5)
            this.linksResult.append(div)
        } else {
            links.forEach(link => {
                const a = this.createElement("a",
                    "list-group-item", "list-group-item-action", "flex-column", "align-items-start")
                a.href = link.url
                a.target = "_blank"
                const linkContainer = this.createElement("div", "link-container")
                const linkImage = this.createElement("img", "link-logo")
                linkImage.src = link.image
                linkImage.onerror = function () {
                    this.onerror = null;
                    this.src = 'https://www.blemishcarecosmetics.com/wp-content/uploads/2021/04/no-image-icon-0.jpg';
                }
                const linkLogoContainer = this.createElement("div", "link-logo-container")
                linkLogoContainer.append(linkImage)
                linkContainer.append(linkLogoContainer)
                const nameContainer = this.createElement("div", "d-flex", "w-100", "justify-content-between")
                const linkNameH5 = this.createElement("h5", "text-primary", "h5", "mb-1")
                linkNameH5.textContent = link.name
                nameContainer.append(linkNameH5)
                const urlContainer = this.createElement("div", "font-size-sm", "text-success", "mb-1")
                urlContainer.textContent = link.url
                const textContainer = this.createElement("div")
                textContainer.append(nameContainer)
                textContainer.append(urlContainer)
                linkContainer.append(textContainer)
                a.append(linkContainer)
                this.linksResult.append(a)
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
        const linksUrl = "https://raw.githubusercontent.com/ilyasamraoui/ilyasamraoui.github.io/main/links.yml"
        this.model.links = await this.fetchLinks(linksUrl)
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
