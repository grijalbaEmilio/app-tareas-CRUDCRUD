export default class carousel {


    constructor(array = [], selector='body') {
           
        let body = document.querySelector(selector)
        body.insertAdjacentHTML('afterbegin', this.#contenedor)
        let puntos = document.querySelector('#puntos')
        let sliders = document.querySelector('#sliders')
        for (let i = 0; i < array.length; i++) {
            sliders.insertAdjacentHTML('beforeend', `
            <input  class="carousel-open" type="radio" id="carousel-${i+1}" name="carousel" aria-hidden="true" hidden="" ${i==0?'checked="checked"':''} />
           <div  class="carousel-item absolute opacity-0 bg-center" style=" height: 500px; background-image: url(${array[i].img});"></div>
          <label for="carousel-${i==0?array.length:i}" class=" control-${i+1} w-10 h-10 ml-2 md:ml-10 absolute cursor-pointer hidden font-bold text-black hover:text-white rounded-full bg-white hover:bg-primary-light leading-tight text-center z-10 inset-y-0 left-0  my-auto ${i == 0 ? 'flex justify-center content-center' : ''} ">
          <i class="fas fa-angle-left mt-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
            <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
            </svg>
          </i>
          </label>
          <label for="carousel-${i == array.length-1 ? '1' : i+2 }" class=" next control-${i+1} w-10 h-10 mr-2 md:mr-10 absolute cursor-pointer hidden font-bold text-black hover:text-white rounded-full bg-white hover:bg-primary-light leading-tight text-center z-10 inset-y-0 right-0 my-auto ">
            <i class="fas fa-angle-right mt-3 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
            <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
            </svg>
          </i>
          </label>
          `)
          puntos.insertAdjacentHTML('beforeend',  `
          <li class="inline-block mr-3">
        <label for="carousel-${i+1}" class=" carousel-bullet cursor-pointer block text-4xl text-white hover:text-primary-light">•</label>`)
    }
}

    #contenedor = `
    <div class="carousel relative rounded overflow-hidden shadow-xl">
    <div class="carousel-inner relative overflow-hidden w-full" id="sliders">
  
      <ol class="carousel-indicators" id="puntos">

      </ol>
    </div>
  </div>`
}