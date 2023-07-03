//la carpeta helpers es para funciones que nos ayudan a hacer algo

const path = require('path');
const { v4: uuidv4 } = require('uuid');

//files pero se podria destructurar desde archivos.files
//extensionesValidas se lo pone como argumento para no aumentar lineas de codigo y despues puede  ser reemplazado por una variable con las extensiones permitidas
//archivo = '' es el nombre donde quiero guardar el archivo, se puede dejar vacio y mas abajo en el codigo el join detecta que es vacio y no generar un error y sigue ejecutando la funcion
const subirArchivo = ( files,extensionesValidas = ['png','jpg','jpeg','gif'], carpeta='') => {

    //tengo mucho codigo que necesito determinar cuando sale bien y cuando mal por lo tanto agrego una promesa
    return new Promise ((resolve,reject) => {

    const {archivo} = files; //este archivo lo voy a pedir entre el parentesis de "const subirArchivo"
    const nombreCortado = archivo.name.split('.'); // split me permite cortar mi string y el pungo es el identificador que uso para ese fin -> la idea es darle formato ".jpg" (por ejemplo)
    const extension = nombreCortado [nombreCortado.length-1]; //para obtener la ultima posicion antes del punto del archivo

    //validar la extension
    
    if (!extensionesValidas.includes(extension)){
        //el return me asegura que no siga ejecutando la funsion
        //el reject porque es promesa y puedo usarlo
        return reject (`La extension ${extension} no es valida, solo: ${extensionesValidas}`);
    }

    // res.json({ extension});


    const nombreTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname,'../uploads/',carpeta,nombreTemp);

    archivo.mv(uploadPath, (err) => { //mv: move o mover al path especificado
        if (err) {   //esto es un callback por si hay un error
            return reject(err);
        }
        
        resolve(nombreTemp);
        //res.json({msg: 'File uploaded to ' + uploadPath}); era lo original
    });

    });


}


module.exports = {
    subirArchivo,
}