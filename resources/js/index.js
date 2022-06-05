"use strict"
import Task from './taskRest.js'
import Carousel from './carousel.js'
import Alert from './alert.js'

let n = 0 

document.addEventListener('DOMContentLoaded', () => {
    menu()
    cargarPg()
    cargarPagina('inicio')

})

async function menu() {

    const icono = document.querySelector('#icono')
    icono.addEventListener('click', e => {
        let menu = document.querySelector('#menu')
        menu.classList.toggle('hidden')
        icono.classList.toggle('hidden')
        let li = document.querySelectorAll('#menu li')
        if (n < 1) { // sólo se debe ejecutar una vez
            for (let i = 0; i < li.length; i++) {
                li[i].addEventListener('click', e => {
                    menu.classList.toggle('hidden')
                    icono.classList.toggle('hidden')
                })
                ++n
            }
        }
    })
}

async function cargarPg() {
    let menu = document.querySelectorAll('#menu li')
    for (let i = 0; i < menu.length; i++) {
        menu[i].addEventListener('click', e => {
            // console.log(e.target.id)
            cargarPagina(e.target.id)
        })
    }
}

async function cargarPagina(pg) {
    const main = document.querySelector('main')
    let respuesta = ''
    let html = ''
    switch (pg) {
        case ('inicio'):
            respuesta = await fetch('resources/views/inicio.html')
            html = await respuesta.text()
            main.innerHTML = html
            Task.init()
            break
        case ('acercaDe'):
            respuesta = await fetch('resources/views/acercaDe.html')
            html = await respuesta.text()
            main.innerHTML = html
            let json = (await fetch('data/paCarousel.json')).json()
            new Carousel(await json, '#paCarousel')
            break
        case ('misTareas'):
            respuesta = await fetch('resources/views/tareasAlert.html')
            html = await respuesta.text()
            main.innerHTML = html
            let data = await Task.dataBox()
            data.forEach(task => {
                let text = task.activity
                let modo = task.priority
                switch (modo) {
                    case 'Aplazable':
                        modo = 'info'
                        break
                    case 'Importante':
                        modo = 'warning'
                        break
                    case 'Inaplazable':
                        modo = 'danger'
                        break
                    case 'Conveniente':
                        modo = 'success'
                        break
                }
            new Alert({
                mode: modo,
                message: text,
                container: "#paAlert"
            })

            })
            break
    }
}