import { TabulatorFull as Tabulator } from '../../node_modules/tabulator-tables/dist/js/tabulator_esm.min.js'
import Modal from './modal.js'
import Helpers from './helpers.js'
import Toast from './toast.js'


export default class Task {

    static #modal
    static #url
    static taskTable

    static dataBox = async() => {
        return await this.retrieveData() 
    }

    static retrieveData = async () => {

        try {
            const data = await Helpers.fetchData(this.#url)
            return data
        } catch (error) {
            Toast.info(
              { message: 'Sin acceso a datos de actividades', mode: 'danger' })
        }
    }

    static init = async() => {

        try {
            const data = await Helpers.fetchData('./data/url.json')
            this.#url = data.url
        } catch (error) {
            Toast.info({ message: 'Endpoint erróneo en ./data/url.json', mode: 'danger' })
        }

        /* const taskData = [
            { id: Task.#random(), dateTime: "2021-11-08T18:00", activity: "Lectura", priority: "Aplazable" },
            { id: Task.#random(), dateTime: "2021-11-08T15:00", activity: "...", priority: "Importante" },
            { id: Task.#random(), dateTime: "2021-11-08T16:00", activity: "...", priority: "Conveniente" },
            { id: Task.#random(), dateTime: "2021-11-08T09:00", activity: "...", priority: "Inaplazable" }
        ] */

        /* const tasksData = JSON.parse(localStorage.getItem('tasks'))
           const taskData = tasksData ? tasksData : [] */

        const formatterParams = {
            inputFormat: "yyyy-MM-dd\'T\'hh:mm",
            outputFormat: "yyyy-MM-dd hh:mm a"
        }

        document.querySelector('#paTabla').innerHTML = '<div id="task-table" class="md:m-3"></div>'

        /* se gusrda en la variable taskTable el componente generado por el constructor de Tabulador */
  
        Task.taskTable = new Tabulator("#task-table", {
            locale: 'es',
            langs: Task.#langs,
            height: '80vh', // según la documentación, este dato es crítico
            data: await this.retrieveData(),
            pagination: true,
            layout: "fitColumns", // ajustar las columnas al ancho de la tabla
            columns: [
                { field: "_id", visible: false }, // ← OJO
                {
                    title: "Fecha/Hora", field: "dateTime", sorter: "date",
                    hozAlign: "center", formatter: "datetime", formatterParams, width: 150
                },
                //{ title: "Actividad", field: "activity", cellClick: (e, cell) => Task.#showData(e, cell) },
                { title: "Actividad", field: "activity",   formatter: "html",  cellClick: (e, cell) => Task.#showData(e, cell) },
                { title: "Prioridad", field: "priority", width: 110, formatter: Task.#formatPriority },
                { formatter: Task.#formatUpdate, width: 40, hozAlign: "center", cellClick: (e, cell) => this.#showUpdate(e, cell) }, //(29)
                { formatter: Task.#formatDelete, width: 40, hozAlign: "center", cellClick: (e, cell) => this.#showDelete(e, cell)} //(33)
            ],

            footerElement: '<button id="add-row" class="tabulator-page"> Agregar tarea </button>'
        })

        /* para la parte de edicion del Modal */
        Task.taskTable.on("tableBuilt", () =>
            document.querySelector('#task-table #add-row').addEventListener(
                'click', e => Task.#showCreate(Task.taskTable)
            )
        )
    }

    //static #random = () => Helpers.random(0, 99999999999999).toString().padStart(14, "0")

    /* retorna el icono con el color deseado */
    static #formatPriority = (cell, formatterParams) => {
        const color = ['info', 'success', 'warning', 'danger']

        let value = cell.getValue()
        value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()

        let formatValue = `
           <span>
              <i class="bi bi-lightbulb-fill text-$color"></i>
              &nbsp;${value}
           </span>
        `
        if (value === 'Aplazable') {
            return formatValue.replace('$color', color[0])
        } else if (value === 'Conveniente') {
            return formatValue.replace('$color', color[1])
        } else if (value === 'Importante') {
            return formatValue.replace('$color', color[2])
        } else {
            return formatValue.replace('$color', color[3])
        }
    }

    /* tiene icono */
    static #formatUpdate = (cell, formatterParams) =>
        `<button class="border-0 bg-transparent">
            <i class="bi bi-pencil-square text-info"></i>
         </button>`

    /* tiene icono */
    static #formatDelete = (cell, formatterParams) =>
        `<button class="border-0 bg-transparent">
            <i class="bi bi-trash text-danger"></i>
         </button>`


    /* se usa oara la configuración del lenguaje */
    static get #langs() {
        return {
            es: {
                columns: {
                    name: "Nombre",
                },
                data: {
                    loading: "Cargando",
                    error: "Error",
                },
                groups: {
                    item: "ítem",
                    items: "ítems",
                },
                pagination: {
                    page_size: "Tamaño de página",
                    page_title: "Ver página",
                    first: "Inicio",
                    first_title: "Primera página",
                    last: "Fin",
                    last_title: "Última página",
                    prev: "Anterior",
                    prev_title: "Anterior página",
                    next: "Siguiente",
                    next_title: "Siguiente página",
                    all: "Todo"
                },
                headerFilters: {
                    default: "columna utilizada para filtrar...",
                    columns: {
                        name: "Nombre del filtro..."
                    }
                }
            }
        }
    }

    /* retorna el contenido para usar en el componente Modal */
    static #htmlForm = (
        { dateTime = '', activity = '', priority = '' } = {}, readOnly = false
    ) => {
        const priorities = [
            { id: '', name: 'Elija una prioridad' },
            { id: '1', name: 'Aplazable' },
            { id: '2', name: 'Conveniente' },
            { id: '3', name: 'Importante' },
            { id: '4', name: 'Inaplazable' }
        ]

        readOnly = readOnly ? 'readonly' : ''

        const strDateTime = dateTime ?
            dateTime.trim() : luxon.DateTime.now().toFormat('yyyy-MM-dd\'T\'hh:mm')

        return `
                 <form class="">
                     <div class="md:flex"> <!-- ** en bloque para dispositivos pequeños ** -->
                         <div class="flex flex-col m-2">
                             <label for="date-time" class="m-1">Fecha y hora</label>
                             <!-- no usar el tipo datetime ya que es obsoleto -->
                             <input type="datetime-local" class="bg-gray-300 p-2 rounded-md" id="date-time"
                              value="${strDateTime}" required ${readOnly}>
                         </div>
                         <div class="flex flex-col m-2 md:w-full">
                             <label for="priority" class="m-1 w-full">Prioridad</label>
                             ${Helpers.htmlSelectList({
            id: 'priority',
            cssClass: 'bg-gray-300 p-3 rounded-md opacity-100',
            items: priorities,
            value: 'id',
            text: 'name',
            firstOption: priority,
            required: true,
            disabled: readOnly
        })}
                         </div>
                     </div>
                     <div class="flex flex-col">
                         <label for="activity" class="m-1">Actividad</label>
                         <!-- definir el textarea en una sola linea: -->
                         <!-- <textarea id="activity" class="bg-gray-300 p-3 rounded-md" placeholder="Descripción de la actividad a realizar" required ${readOnly}>${activity.trim()}</textarea> -->
                         <div id="activity" class="alert"> ${activity.trim()} </div>

                     </div>
                 </form>`
    }


    /* Crea la instancia Modal con lod datos requeridos, solo mestra contenido(no se edita) */
    static #showData = (e, cell) => {

        const data = cell.getRow().getData()
        

        Task.#modal = new Modal({
            title: 'Ver registro',
            width: 'modal-lg',
            content: Task.#htmlForm(data, true),
            buttons: [
                {
                    id: 'close',
                    class: 'btn bg-gray-400',
                    innerHTML: 'Salir',
                    callBack: () => Task.#modal.dispose()
                }
            ]
        }).show()
    }

    //-------------------------- para editar datos de actividades(22)

    /* accesor que retornar un objeto con los datos que contiene el formulario */
    static get #formData() {
        const refDateTime = document.querySelector(`#${Task.#modal.id} #date-time`)
        const dateTime = refDateTime.value = refDateTime.value.trim() //trim() elimina espacios inicio y fin

        const refActivity = document.querySelector(`#${Task.#modal.id} #activity`)
        //const activity = refActivity.value = refActivity.value.trim()

        let activity = '' 
        const html = Helpers.editor.getContents().trim()
        // Ver Helpers.sunEditor >> defaultTag = <div>[invisible char]<br></div> 
        if (html.length > 16) {
            activity = html
        }

        const priority = Helpers.selectedItemList(`#${Task.#modal.id} #priority`).text

        return { dateTime, activity, priority }
    }

    /* Valida los datos recibidos y si son correctos, crear nuevas tareas y agregarlas a la tabla:  */
    static #create = async (table) => {

        if (!Helpers.okForm(`#${Task.#modal.id} form`)) { // validar los datos. Ver esto
            Toast.info({ message: 'Datos incompletos o incorrectos', mode: 'warning' })
            return
        }

        try {
            const data = await Helpers.fetchData(this.#url, {
                method: 'POST',
                body: Task.#formData // ← datos para el nuevo registro
            })
            table.addRow(data, true)
            Toast.info({ message: 'Nueva actividad registrada' })
        } catch (error) {
            Toast.info({ message: 'Error al crear la actividad', mode: 'danger', error })
        }

        Task.#modal.dispose()
    }


    /* crea el Modal editable */
    static #showCreate = (table) => {

        Task.#modal = new Modal({
            title: 'Actualizar registro',
            styles: 'modal-lg',
            content: Task.#htmlForm(), //Llama a #htmlFrom que retorna el contenido para editar
            modalBuilt: (idModal) => {
                Helpers.sunEditor(`#${idModal} #activity`)
            },
            buttons: [
                {
                    id: 'create',
                    class: 'btn bg-gray-500',
                    innerHTML: 'Agregar',
                    callBack: () => Task.#create(table) // ver punto anterior 
                },
                {
                    id: 'cancel',
                    class: 'btn bg-gray-400',
                    innerHTML: 'Cancelar',
                    callBack: () => Task.#modal.dispose()
                }
            ]
        }).show()
    }

    /* Actualiza información del modal de la tabla con los datos del modal(27) */
    static #update = async (row) => {

        if (!Helpers.okForm(`#${Task.#modal.id} form`)) {
            Toast.info({ message: 'Datos incompletos o incorrectos', mode: 'warning' })
            return
        }

        const url = `${this.#url}/${row.getData()._id}` // ← endpoint

        try {
            await Helpers.fetchData(url, {
                method: 'PUT',
                body: Task.#formData // ← nuevos datos
            })

            row.update(Task.#formData)
            Toast.info({ message: 'Actividad actualizada' })
        } catch (error) {
            Toast.info(
               { message: 'Error al actualizar la actividad', mode: 'danger', error }
            )
        }

        Task.#modal.dispose()
    }

    /* crea el modal para actualizar información de la tabla */
    static #showUpdate = (e, cell) => {

        const data = cell.getRow().getData() // recuperar los datos de la fila actual

        Task.#modal = new Modal({
            title: 'Actualizar registro',
            styles: 'modal-lg',
            content: Task.#htmlForm(data), // mostrar los datos de la fila actual
            modalBuilt: (idModal) => {
                Helpers.sunEditor(`#${idModal} #activity`, data.activity)
            },
            buttons: [
                {
                    id: 'update',
                    class: 'btn bg-gray-500 ',
                    innerHTML: 'Actualizar',
                    callBack: () => Task.#update(cell.getRow()) // Ver “Retrieving Data”
                },
                {
                    id: 'cancel',
                    class: 'btn bg-gray-400',
                    innerHTML: 'Cancelar',
                    callBack: () => Task.#modal.dispose()
                }
            ]
        }).show()
    }

    /* elimina fila de la tabla */
    static delete = async (row) => {
        const url = `${this.#url}/${row.getData()._id}`

        try {
            const data = await Helpers.fetchData(url, {
                method: 'DELETE',
            })

            row.delete()
            Toast.info({ message: 'Actividad eliminada' })
        } catch (error) {
            Toast.info(
               { message: 'Error al eliminar la actividad', mode: 'danger', error }
            )
        }

        try{Task.#modal.dispose()}catch(e){}
    }


    /* para confirmar la eliminación de la fila(31) */
    static #showDelete = (e, cell) => {
        const data = cell.getRow().getData()

        Task.#modal = new Modal({
            title: 'Eliminar registro',
            styles: 'modal-lg',
            content: `Eliminar la actividad "${data.activity}"`,
            buttons: [
                {
                    id: 'delete',
                    class: 'btn bg-red-500 ',
                    innerHTML: 'Eliminar',
                    callBack: () => Task.delete(cell.getRow())
                },
                {
                    id: 'cancel',
                    class: 'btn bg-gray-400 ',
                    innerHTML: 'Cancelar',
                    callBack: () => Task.#modal.dispose()
                }
            ]
        }).show()
    }


}