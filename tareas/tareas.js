const mesero = JSON.parse(localStorage.getItem('user'));
const mesas = JSON.parse(localStorage.getItem('mesas'));
console.log(mesero)
console.log(mesas)

//* SELECTORES:
const BtnNuevoP = document.querySelector('#form-btn');
const cerrarBtn = document.querySelector('#cerrar-btn');
const lista = document.querySelector('#todos-list');

//Validar la ruta:
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
    localStorage.removeItem('user');
    window.location.href = '../home/index.html';
})