const mesero = JSON.parse(localStorage.getItem('user'));
console.log(mesero)

//* SELECTORES:
const BtnNuevoP = document.querySelector('#form-btn');
const cerrarBtn = document.querySelector('#cerrar-btn');
const lista = document.querySelector('#todos-list');

//* Validar la ruta:
if(!mesero){
    //caso de que el usuario no este en el localsotrage(no inicio sesion)
    window.location.href = '../home/index.html';
}

//* EVENTOS:

BtnNuevoP.addEventListener('click', async e=> {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify(mesero))
    window.location.href = '../pedidos.html';
})

cerrarBtn.addEventListener('click', async e=> {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = '../home/index.html';
})

document.addEventListener('DOMContentLoaded', obtenerLista);



//* FUNCIONES:

async function obtenerLista(){

    limpiarHTML();

    //Bienvenido
    const body = document.querySelector('body');
    const saludo = document.createElement('h2');
    saludo.textContent = `Bienvenid@ ${mesero.nombre}`;
    body.appendChild(saludo);


    //Obtener la lista de mesas atendidas:

    const respuesta = await fetch('http://localhost:3000/clientes',{
        method: 'GET',
    });

    const list = await respuesta.json();
    const userList = list.filter(i => i.mesero === mesero.nombre);

    console.log(userList)

    //Mostrar lista en pantalla:
    userList.forEach(i => { 

        const listado = document.createElement('li');
        listado.innerHTML = `
        <li id=${i.id} class="todo-item">
        <button class="delete-btn">&#10006;</button>
        <p class="${i.checked ? 'check-todo' : false}" style="font-weight: bold">MESA ${i.cliente.mesa}</p>
        <p>Hora ${i.cliente.hora}</p>
        <p style="font-weight: bold">Total: $${i.cliente.total}</p>
        <button class="check-btn">&#10003;</button>
        </li>`;
        lista.appendChild(listado);
    })

}

lista.addEventListener('click', async e=> {
    if(e.target.classList.contains('delete-btn')){
        ////console.log('eliminar');
        const id = e.target.parentElement.id;
        ////console.log(id)
        await fetch(`http://localhost:3000/clientes/${id}`, {
            method: 'DELETE'
        });
        e.target.parentElement.remove();
    }else if(e.target.classList.contains('check-btn')){
        ////console.log('check');
        const id = e.target.parentElement.id;
        ////console.log(id)
        const respuestaJSON = await fetch(`http://localhost:3000/clientes/${id}`,{
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({checked:e.target.parentElement.classList.contains('check-todo')?false:true})
        })
        const response = await respuestaJSON.json();
        console.log(response)
        e.target.parentElement.classList.toggle('check-todo');
    }
    ////location.reload();
})


function limpiarHTML(){
    while(lista.firstChild){
        lista.removeChild(lista.firstChild);
    }
}