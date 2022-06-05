export default class Modal {

    #clon

    constructor({
        width = 'max-w-3xl',
        title = 'Título...',
        content = 'Contenido...',
        modalBuilt = null,
        buttons = []
    } = {}) {
        // clonar el nodo del DOM que tiene definido el modal
        const modal = document.querySelector('#modal')
        this.#clon = modal.cloneNode(true) // asigna a la variable privada "clon" un clon del nodo modal

        // asignarle al nuevo nodo un identificador único y agregarlo al DOM
        const random = Math.floor(Math.random() * 99999999999999).toString().padStart(14, "0")
        this.#clon.id = `${this.#clon.id}-${random}`
        document.querySelector('#utilities').before(this.#clon) //inyecta el nodo clonado antes del nodo "#utilities"
        // equivale a document.querySelector('#utilities').insertAdjacentElement('beforebegin', this.#clon)

        //uso de mutadores
        this.title = title        
        this.content = content
        this.width = width

        document.querySelector(`#${this.#clon.id} header #close`).addEventListener(
            'click', () => this.close()
        )

        const footer = document.querySelector(`#${this.#clon.id} footer`)

        if (buttons.length > 0) {
            buttons.forEach(b => this.#createButton(b, footer))
        } else {
            footer.classList.add('hidden')
        }
        
        if (typeof modalBuilt === 'function') {
            modalBuilt(this.#clon.id)
        }
    }

    /**
     * Establece el título del cuadro de diálogo
     * @param {string} strTitle
     */
    set title(strTitle) {
        document.querySelector(`#${this.#clon.id} #title`).innerHTML = strTitle
        return this
    }

    /**
     * Establece el contenido del cuadro de diálogo
     * @param {string} strContent
     */
    set content(strContent) {
        document.querySelector(`#${this.#clon.id} #content`).innerHTML = strContent
        return this
    }

    /**
     * Establece el ancho máximo que puede llegar a tener el modal
     * @param {string} strWidth
     */
    set width(strWidth) {
        document.querySelector(`#${this.#clon.id} > div`).classList.add(strWidth)
        return this
    }

    get id(){
        return this.#clon.id
    }

    close() {
        this.#clon.classList.add("hidden") // simplemente oculta el modal
        return this
    }

    dispose() {
        this.#clon.remove() // elimina del DOM
        this.#clon = null   // elimina la referencia
    }

    show() {
        if (this.#clon) {
            this.#clon.classList.remove("hidden")
        } else {
            console.log('No ya una instancia de Modal para ser mostrada');
        }
        return this
    }

    #createButton(b, footer) {
        const html = `<button id="${b.id}" class="${b.class}">${b.innerHTML}</button>`
        footer.insertAdjacentHTML('beforeend', html)
        const button = document.querySelector(`#${this.#clon.id} footer #${b.id}`)

        if (typeof b.callBack === 'function') {
            button.addEventListener('click', e => b.callBack(e))
        }
    }



}