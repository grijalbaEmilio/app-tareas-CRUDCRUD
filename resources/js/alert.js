import Helpers from './helpers.js'
import Task from './taskRest.js'

export default class Alertr {
    
    constructor(data = {}) {
        let mode = this.#cual(data.mode)
        let message = data.message
        let container = document.querySelector(data.container)

        const id = Helpers.random(0, 99999999999999).toString().padStart(14, "0")

        container.insertAdjacentHTML('beforeend', this.#alertDefault.translate(mode.bg, mode.text, mode.icono, message, id))
        
        let alert = document.querySelectorAll('#alert-'+id) // nodo con el componmente recien agregado
        let close = alert[0].childNodes[5].childNodes[1] // nodo con icono de cierre (x)

        /* remover una tarea desde las alertas */
        close.addEventListener('click', ()=> {
            alert[0].remove() //alert[0] contiene el html a quitar
            let rows = Task.taskTable.rowManager.rows //filas de la tabla
            for (let i = 0; i < rows.length; i++){
                if(rows[i].data.activity == message){
                    Task.delete(rows[i].component) //se efectua la eliminación (.component recupera la fila como objeto)
                }           
            }
        })
    }
    #alertDefault =
        `
<div id="alert-$4" class=" flex items-center $0 $1 px-4 py-3 rounded-lg my-2 relative md:m-8" role="alert">
        <div class="$2 text-3xl mr-4"></div>
        <span class="block sm:inline">$3</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3 flex items-center">
          <svg class="close fill-current h-6 w-6 text-gray-700"  role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Cerrar</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.671 3.029a1.2 1.2 0 1 1-1.697-1.697l2.778-3.17-2.779-3.172a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.671-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.778 3.172 2.778 3.17a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
</div>
`
    #modo = {
        danger: {
            bg: "bg-red-100",
            text: "text-red-500",
            icono: "bi bi-exclamation-triangle-fill"
        },
        warning: {
            bg: "bg-yellow-100",
            text: "text-yellow-500",
            icono: "bi bi-exclamation-triangle-fill"
        },
        info: {
            bg: "bg-blue-100",
            text: "text-blue-500",
            icono: "bi bi-info-circle-fill"
        },
        success: {
            bg: "bg-green-100",
            text: "text-green-500",
            icono: "bi bi-check-circle-fill"
        }
    }

    #cual(mod) {
        switch (mod) {
            case 'warning':
                return this.#modo.warning
            case 'danger':
                return this.#modo.danger
            case 'info':
                return this.#modo.info
            case 'success':
                return this.#modo.success
            default:
                console.log('el modo "'+mod+'" no es válido')
                break;
        }

    }
}