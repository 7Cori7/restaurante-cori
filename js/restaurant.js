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

        /*const agregar = document.createElement('div');
        agregar.classList.add('col-md-1','py-3');
        agregar.appendChild(inputCantidad);*/

        fila.appendChild(nombre);
        fila.appendChild(precio);
        fila.appendChild(categoria);
        fila.appendChild(inputCantidad);
        //fila.appendChild(agregar);

        contenido.appendChild(fila);
    })
}

function agregarOrden(producto){


    let {pedido} = cliente; //<---extraigo el objeto pedido del arreglo cliente
    //console.log(producto)//?<---corroboramos que si hay un cambio en el input lo guarde en el objeto

    const {pro} = cliente.pedido;

    if(producto.cantidad > 0){

        //validar que el producto exista:
        const existe = pedido.some(item=>item.id === producto.id);

        if(existe){
            //caso en que haya producto
            const pedidoActualizado = pedido.map(i=>{
                if(i.id === producto.id){
                    i.cantidad = producto.cantidad;
                }
                return i;
            })

            cliente.pedido = [...pedidoActualizado]; //<--se actualiza el arreglo con lo que trae el nuevo arreglo pedidoActualizado

        }else{
            //caso de que no exista el producto
            //agregamos el nuevo producto al arreglo
            cliente.pedido = [...pedido, producto];
            
        }
    }else{
        //caso en que cantidad es 0
        console.log('esta en cero')
        const resultado = pedido.filter(item=>item.id !== producto.id);
        cliente.pedido = resultado;
    }

    limpiarHTML();

    ////console.log(cliente)
    

   if(cliente.pedido.length){
        actualizarResumen();
   }else{
        mensajePedidoVacio();
    }
}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'shadow', 'py-5', 'px-3');

    //mostrar la mesa
    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaCliente = document.createElement('span');
    mesaCliente.textContent = cliente.mesa;
    mesa.appendChild(mesaCliente);

    //mostrar hora
    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaCliente = document.createElement('span');
    horaCliente.textContent = cliente.hora;
    hora.appendChild(horaCliente);

    //Mostrar heading:
    const heading = document.createElement('h3');
    heading.textContent = 'Pedidos:';
    heading.classList.add('my-4');

    //Producto Pedido:
    const {pedido} = cliente;

    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    pedido.forEach(item=>{
        const {nombre, cantidad, precio, id} = item;

        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreP = document.createElement('h4');
        nombreP.textContent = nombre;
        nombreP.classList.add('text-center', 'my-4');

        const cantidadP = document.createElement('p');
        cantidadP.textContent = 'Cantidad: ';
        cantidadP.classList.add('fw-bold');

        const  cantidadValor = document.createElement('span');
        cantidadValor.textContent = cantidad;

        const precioP = document.createElement('p');
        precioP.classList.add('fw-bold');
        precio.textContent = 'precio: ';

        const precioValor = document.createElement('span');
        precioValor.textContent = `$${precio}`;

        cantidadP.appendChild(cantidadValor);
        precioP.appendChild(precioValor);

        //Subtotal:
        const subtotalP = document.createElement('p');
        subtotalP.classList.add('fw-bold');
        subtotalP.textContent= 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.textContent= calcularSubtotal(item);

        subtotalP.appendChild(subtotalValor);

        //boton eliminar:
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn','btn-danger');
        btnEliminar.textContent = 'Eliminar Pedido';

        btnEliminar.onclick = function(){
            eliminarProducto(id);
        }


        //Ubicar en el div:

        lista.appendChild(nombreP);
        lista.appendChild(cantidadP);
        lista.appendChild(precioP);
        lista.appendChild(subtotalP);
        lista.appendChild(btnEliminar);

        grupo.appendChild(lista);

    })

    
    
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    contenido.appendChild(resumen);

    //mostrar la calculadora de propinas:
    formularioPropinas();
}

function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario', 'px-5');

    const heading =  document.createElement('h3');
    heading.classList.add('my-4');
    heading.textContent = 'Propina';

    //propina 5%
    const op5 = document.createElement('input');
    op5.type = 'radio';
    op5.name = 'propina';
    op5.value = '5';
    op5.classList.add('form-check-input');
    op5.onclick = calcularPropina;

    const labelop5 = document.createElement('label');
    labelop5.textContent = '5%';
    labelop5.classList.add('form-check-label');

    //propina 10%
    const op10 = document.createElement('input');
    op10.type = 'radio';
    op10.name = 'propina';
    op10.value = '5';
    op10.classList.add('form-check-input');
    op10.onclick = calcularPropina;

    const labelop10 = document.createElement('label');
    labelop10.textContent = '10%';
    labelop10.classList.add('form-check-label');

    //Imprimir en el HTML:
    formulario.appendChild(heading);
    formulario.appendChild(labelop5);
    formulario.appendChild(op5);

    
    formulario.appendChild(labelop10);
    formulario.appendChild(op10);


    contenido.appendChild(formulario);

    

}

function calcularPropina(){

    ////console.log('calcularPropina')
    //forma de seleccionar cualquier input:
    const radioSeleccionado = document.querySelector('[name="propina"]:checked').value;
    ////console.log(radioSeleccionado)

    //calcula todo:
    const {pedido} = cliente;
    let subtotal = 0;

    pedido.forEach(i=>{
        subtotal += i.cantidad * i.precio;
    })

    //contenedores HTML:

    const divTotales =  document.createElement('div');
    divTotales.classList.add('total-pagar');

    const formulario = document.querySelector('.formulario');

    //HTML propina
    const propina = (subtotal*parseInt(radioSeleccionado))/100;
    const iva = subtotal*0.16;
    const total = propina + iva + subtotal;

    //HTML subtotal
    const subtotalP = document.createElement('p');
    subtotalP.textContent = 'Subtotal Pedido: ';
    subtotalP.classList.add('fw-bold','fs-3','mt-5');

    const subtotalValor = document.createElement('span');
    subtotalValor.textContent = `$${subtotal}`;

    subtotalP.appendChild(subtotalValor);

    //HTML iva
    const ivaP = document.createElement('p');
    ivaP.textContent = 'IVA 16%: ';

    const ivaValor = document.createElement('span');
    ivaValor.textContent =  `$${iva}`;
    ivaP.appendChild(ivaValor);

    //HTML propina
    const propinaP = document.createElement('p');
    propinaP.textContent = 'Propina: ';

    const propinaValor = document.createElement('span');
    propinaValor.textContent = `$${propina}`;
    propinaP.appendChild(propinaValor);

    //HTML Total a pagar
    const totalP = document.createElement('p');
    totalP.classList.add('fw-bold','fs-2','mt-3');
    totalP.textContent = 'Total a pagar: ';


    const totalValor = document.createElement('span');
    totalValor.textContent = `$${total}`;
    totalP.appendChild(totalValor);

    divTotales.appendChild(subtotalP);
    divTotales.appendChild(ivaP);
    divTotales.appendChild(propinaP);
    divTotales.appendChild(totalP);

    formulario.appendChild(divTotales);

}

function calcularSubtotal(p){
    const {cantidad, precio} = p;

    return `$${cantidad*precio}`;
}

function eliminarProducto(id){
    const {pedido} = cliente;

    cliente.pedido =  pedido.filter(i=>i.id !== id);

    limpiarHTML();

    ////console.log(cliente.pedido.length);
    if(cliente.pedido.length > 0){
        actualizarResumen();
    }else{
        ////console.log('pedido vacio')
        mensajePedidoVacio();
    }
    
    //ahora como eliminamos el producto debemos actualizar la cantidad a cero
    //esta es una manera para ubicarse en el input
    //todo: probar algo asi para el de las chucherias (clase agotado)
    const productoEliminado = `#producto-${id}`//<--este es un id nuevo que se le esta colocando al input 
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Agrega producto al pedido';
    contenido.appendChild(texto);
}

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }
}


//todo: HACER UNA FUNCION PARA AGREGAR OTRAS MESAS (con un asign-await) como en el ejercicio agregar-crea usuario. Con un JSON array que tenga:

//* Con inicio de sesion para el mesero

//* Guardar el cliente (mesa) con el id del mesero y su pedido

//* Menu