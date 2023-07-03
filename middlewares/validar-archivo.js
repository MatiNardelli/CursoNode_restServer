//este middlewares se crea para no tener que validar el campo-
//cada vez que se necesita enviar un archivo en el body de la peticion.
//Se hace una vez y se llama al middleware...

//los middleware necesitan el req, res y next

const {response} = require('express');

const validarArchivoSubir = (req, res=response, next) =>{

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({
            msg:'Sin archivos para subir'
        });
        
    }

    next();
}


module.exports = {validarArchivoSubir}