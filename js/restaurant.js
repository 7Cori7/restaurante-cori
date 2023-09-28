//Selectores:
const btnGuardarCliente = document.querySelector('#guardar-cliente');

//Estructura para guardar
let cliente = {
    mesa:'',
    hora:'',
    pedido:[]
}

const categorias = {
    1:'Pizzas',
    2:'Postres',
    3:'Jugos',
    4:'Comida',
    5:'Cafe',
    6:'Bebidas'
}

//Eventos:
btnGuardarCliente.addEventListener('click', guardarCliente);

//Funciones:
function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Validar los campos:

    
    const camposVacios = [mesa,hora].some(campo=>campo === ''); // <--- una alternativa a un if(mesa ==='' || hora ==='')

    if(camposVacios){
        //Si estan vacios:
        console.log('campos vacios')
        const  existeAlerta = document.querySelector('.invalid-feedback'); //<---esta clase se utiliza como "bandera" (no se encuentra en el html)

        if(!existeAlerta){
            const alerta = document.createElement('div');
            alerta.classList.add('text-center', 'text-danger');
            alerta.textContent = 'Los campos son obligatorios';

            //ubicar la alerta en el html:
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 2000);
        }
    }else{
        //Si los campos estan llenos:
        //console.log('campos llenos')

        cliente = {...cliente,mesa,hora};//<---se capturan los datos actuales en el objeto
        console.log(cliente)

        //metodo de bootstrap para esconder la ventana:
        const modalForm = document.querySelector('#formulario');
        const modal = bootstrap.Modal.getInstance(modalForm);//<--todo esto solo funciona si se usa bootstrap.
        modal.hide();

        mostrarSecciones();
        obtenerMenu();
    }
}

function mostrarSecciones(){
    const secciones = document.querySelectorAll('.d-none');//<---esto selecciona todas las clases
    console.log(secciones)

    secciones.forEach(seccion=>seccion.classList.remove('d-none'));//<---esto quita la clase seleccionada
}

function obtenerMenu(){

    //Generar un recurso:

    const url = 'http://localhost:3000/menu';

    fetch(url)
    .then(respuesta=>respuesta.json())
    .then(resultado=>mostrarMenu(resultado))
    .catch(error=>console.log(error))
}

function mostrarMenu(menu){
    const contenido = document.querySelector('#menu .contenido');
    menu.forEach(pos=>{
        const fila = document.createElement('div');
        fila.classList.add('row','border-top');
        const nombre = document.createElement('div');
        nombre.textContent = pos.nombre;
        nombre.classList.add('col-md-4','py-3');

        const precio = document.createElement('div');
        precio.textContent = `$${pos.precio}`;
        precio.classList.add('col-md-3','py-3');

        const categoria = document.createElement('div');
        categoria.textContent = categorias[pos.categoria];
        categoria.classList.add('col-md-3','py-3');

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${pos.id}`;
        inputCantidad.classList.add('col-md-1');
        inputCantidad.onchange = function(){ //<--detecta un cambio
            const cantidad = parseInt(inputCantidad.value);
            //console.log({...pos,cantidad})
            agregarOrden({...pos,cantidad});//<--le envio el json + la cantidad
        }

        fila.appendChild(nombre);
        fila.appendChild(precio);
        fila.appendChild(categoria);
        fila.appendChild(inputCantidad);

        contenido.appendChild(fila);
    })
}