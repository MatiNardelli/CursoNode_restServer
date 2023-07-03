const {Role, 
       Usuario,
       Categoria} = require('../models');


const esRoleValido = async(rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

const existeCategoriaPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCategoriaPorId = await Categoria.findById(id);
    if ( !existeCategoriaPorId ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

//validar conexiones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones =[]) => {
    //ahora hay que verificar que la variable exista en el arreglo -> coleccion este en colecciones
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, solo: ${colecciones}`);
    }

    return true; //se deberia colocar en todas pero bueno esta implicita

}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    coleccionesPermitidas,
}

