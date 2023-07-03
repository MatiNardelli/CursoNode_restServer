const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

module.exports={
    ...dbValidators,    //los tres puntos me exportan todas las propiedas(funion,constante,variable)
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
}