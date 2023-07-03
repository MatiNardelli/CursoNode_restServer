//importaciones de Node primero 
const path = require('path');
const fs = require('fs');

//importaciones de terceros
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const {response} = require ('express');
const { subirArchivo } = require('../helpers');


const {Usuario,Producto} = require('../models');

const cargarArchivo = async(req, res = response) => {


    //Imagenes: por eso no coloco extensiones permitida uso las de defecto
    //vamos a requerir la extension del archivo
    //txt, md
    //los colocamos dentro de un try - catch por la promesa sino revienta y se queda pegado
    //argumento undefined permite enviar todos los tipos de archivos
    try{
        //const extPermitidas = ['txt','md'];
        const nombre = await subirArchivo(req.files, undefined,'imgs'); 
        res.json({
            nombre: nombre
        })
    }catch(msg){
        res.status(400).json({msg});
    }

}

//como async porque necesito hacer grabaciones en base de dato
const actualizarImagen = async (req,res=response) => {
    const {id, coleccion} = req.params; //esto es la extension del end point (tiene que ser mongo ID valido)

    let modelo; //let porque voy a establecer su valor de manera condicional

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id); 
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}` 
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    //limpiar imagenes previas -> img es una propiedad del objeto usuario o producto
    if (modelo.img){
        //entonces, borramos imagen del servidor
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img); //__dirname path actual(controllers/uploads) -> ../upload: voy una carpeta atras y cambio controllers por uploads -> coleccion digo si es usuario o producto
        if (fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen); //si pasa validacion aca lo borra
        }
    };

    //en la parte de modelos tenemos que es img
    const nombre = await subirArchivo(req.files, undefined,coleccion); 
    modelo.img = nombre;

    await modelo.save();

    res.json(modelo);
}

const actualizarImagenCloudinary = async (req,res=response) => {
    const {id, coleccion} = req.params; //esto es la extension del end point (tiene que ser mongo ID valido)

    let modelo; //let porque voy a establecer su valor de manera condicional

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id); 
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}` 
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    //limpiar imagenes previas -> img es una propiedad del objeto usuario o producto
    if (modelo.img){

        const nombreArr = modelo.img.split('/'); //que me divida el url por "/"
        const nombre = nombreArr[nombreArr.length - 1 ]; //-1 para obtener la ultima posicion
        const [public_id] = nombre.split('.'); //split genera un nuevo arreglo cortador por algo       
        cloudinary.uploader.destroy(public_id);    
    };
    

    const {tempFilePath} = req.files.archivo
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath); //devuelve una promesa
    modelo.img=secure_url;

    await modelo.save();
    //res.json(modelo.img);
    res.json(modelo);
}



const mostarImagen = async (req,res=response) => {
    const {id, coleccion} = req.params;

    // res.json({
    //     id,coleccion
    // })

    //se podria poner esto en un helper nosotros lo copiamos y pegamos xq se iba de tiempo Fernando
    let modelo; //let porque voy a establecer su valor de manera condicional

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id); 
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}` 
                });
            }
        break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
        break;
    
        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
    }

    //limpiar imagenes previas -> img es una propiedad del objeto usuario o producto
    if (modelo.img){
        //entonces, borramos imagen del servidor
        const pathImagen = path.join(__dirname,'../uploads',coleccion,modelo.img); //__dirname path actual(controllers/uploads) -> ../upload: voy una carpeta atras y cambio controllers por uploads -> coleccion digo si es usuario o producto
        if (fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen)
            
        }
    }else{
        const pathImagen = path.join(__dirname,'../assest','No-Image.jpg');
        return res.sendFile(pathImagen);
    };


    //res.json({msg: 'falta place holder'});
    //si no existe hacer que mande la imagen que esta en assest


}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostarImagen,
    actualizarImagenCloudinary,
}