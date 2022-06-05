import '../../node_modules/suneditor/dist/suneditor.min.js'
import '../../node_modules/suneditor/src/lang/es.js'


export default class Helpers {

    //--------------------------------editor--------------------------->

    static editor

    static sunEditor = (reference, value = '') => {

        if (Helpers.editor !== undefined) {
            Helpers.editor.destroy()
        }
        Helpers.editor = SUNEDITOR.create(document.querySelector(reference), {
            lang: SUNEDITOR_LANG['es'],
            buttonList: [
                ['bold', 'underline', 'italic'],
                ['fontColor', 'hiliteColor'],
                ['undo', 'redo'],
                ['outdent', 'indent'],
                ['align', 'horizontalRule', 'list', 'lineHeight'],
                ['table', 'link'],
            ],
            height: 'auto',
            defaultStyle: 'font-size: 1em',
            maxCharCount: "3000",
            defaultTag: 'div',
            value // no es un error, es una asignación automática 
        })
    }

    //--------------------------------editor---------------------------<
    /**
     * Permite conocer el elemento seleccionado de un conjunto de radio buttons
     * @param {String} selector Un selector CSS que permite seleccionar el grupo de radio buttons
     * @returns {String} Retorna el atributo value del radio button seleccionado
     */
    static selectedRadioButton = selector => {
        const radio = document.querySelector(selector + ":checked")
        return radio ? radio.value : radio
    }

    static getItems = selector => {
        const items = document.querySelectorAll(selector)
        return [...items].map((item) => { // operador rest >  desestructuración
            return { value: item.value, checked: item.checked }
        })
    }

    static selectedItemList = selector => {
        const list = document.querySelector(selector)
        const item = list.options[list.selectedIndex]
        return {
            selectedIndex: list.selectedIndex,
            value: item.value,
            text: item.text,
        }
    }

    static populateSelectList = (selector, items = [], value = '', text = '', firstOption = '') => {
        let list = document.querySelector(selector)
        list.options.length = 0
        if (firstOption) {
            list.add(new Option(firstOption, ''))
        }
        items.forEach(item => list.add(new Option(item[text], item[value])))
        return list
    }

    static loadPage = async (url, container) => {
        try {
            const element = document.querySelector(container)
            if (!element) {
                throw new Error(`Parece que el selector '${container}' no es válido`)
            }

            const response = await fetch(url)
            // console.log(response);
            if (response.ok) {
                const html = await response.text()
                element.innerHTML = html
                return element // para permitir encadenamiento
            } else {
                throw new Error(
                    `${response.status} - ${response.statusText}, al intentar acceder al recurso '${response.url}'`
                )
            }
        } catch (e) {
            console.log(e)
        }
    }

    /* static fetchData = async url => {

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(
                `${response.status} - ${response.statusText}, al intentar acceder al recurso '${response.url}'`
            )
        }

        return await response.json()
    } */

    /**
     * Genera un número entero aleatorio en un rango determinado
     * @param {int} min El intervalo inferior
     * @param {int} max El intervalo superior
     * @returns {int} Un valor aleatorio entero en un rango determinado
     */
    static random = (min, max) => {
        min = Math.ceil(min) // aproximar al entero superior
        max = Math.floor(max) // aproximar al entero inferior
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    //----------------semana 13

    static htmlSelectList = ({
        id = '',
        cssClass = '',
        items = [],
        value = '',
        text = '',
        firstOption = '',
        required = true,
        disabled = false
    }) => {
        required = required ? 'required' : ''
        disabled = disabled ? 'disabled' : ''
        let list = ''

        items.forEach(item => {
            if (firstOption === item[text]) {
                list += `<option value="${item[value]}" selected>${item[text]}</option>`
            } else {
                list += `<option value="${item[value]}">${item[text]}</option>`
            }
        })

        return `<select id ="${id}" class="${cssClass}" ${required} ${disabled}>
                    ${list}
                </select>`
    }

    /**
     * 
     * @param {object} formSelector referencia a la lista selecionable
     * @param {*} callBack función para hacer validaciones no soportadas por HTML
     * @returns 
     */
    static okForm = (formSelector, callBack) => {
        let ok = true
        const form = document.querySelector(formSelector)

        if (!form.checkValidity()) {
            let tmpSubmit = document.createElement('button')
            form.appendChild(tmpSubmit)
            tmpSubmit.click()
            form.removeChild(tmpSubmit)
            ok = false
        }

        if (typeof callBack === 'function') {
            ok = ok && callBack()
        }

        return ok
    }

    //---------------------- refactorización de fetchData() para las CRUD ---------

    static isEmptyObject = (value) => (
        Object.keys(value).length === 0 && value.constructor === Object //comprueba que no esté vacío y sea de tipo Object
    )

    static fetchData = async (url, options = {}) => {

        let response = null

        if (!this.isEmptyObject(options)) {
            if (!('headers' in options)) {
                options.headers = {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }

            if ('body' in options) {
                options.body = JSON.stringify(options.body)
            }
            response = await fetch(url, options)
        } else {
            response = await fetch(url)
        }

        if (typeof response !== 'object') {
            throw new Error(`La respuesta de ${url} no es la esperada: `, response)
        }

        if (!this.isEmptyObject(response) && !response.ok) {
            throw new Error(
               `Error al cargar ${url}: ${response.status} - ${response.statusText}`
            )
        }

        const data = response.headers.get("content-type") === null ? '{}' : await response.json()

        return data
    }





    //---------------------- refactorización de fetchData() para las CRUD ---------


}

// ---------------------------------------------------

/**
 * Cambia las ocurrencias de $# por los strings indicados como argumento. Ejemplo:
 * let z = 'Probando $0 de $1 con $2'.translate('strings', 'JavaScript', 'expresiones regulares')
 * retorna 'Probando strings de JavaScript con expresiones regulares'
 *
 * @param  {...any} texts los strings que se usan para hacer el reemplazo
 * @returns El string original con los reemplazos realizados
 */
String.prototype.translate = function (...texts) {
    let str = this
    const regex = /\$(\d+)/gi // no requiere comprobación de mayúsculas pero se deja como ejemplo
    return str.replace(regex, (item, index) => texts[index])
}


String.prototype.remover = function (array) {
    let str = this
    for (let i = 0; i < array.length; i++) {
        str = str.replaceAll(array[i], '')
    }
    return str.trim()
}