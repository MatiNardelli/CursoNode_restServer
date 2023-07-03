const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const{cargarArchivo, actualizarImagen, mostarImagen, actualizarImagenCloudinary}=require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();

router.post('/',[validarArchivoSubir] ,cargarArchivo); //post: para crear algo nuevo (convenio) - > pull si quiero actualizar

//para actualiar: primer argumento end point, segundo los check para validar y tercero los controlador
router.put('/:coleccion/:id',[
    //la coleccion debe estar dentro de un arreglo y hacemos check para eso
    //'c' es coleccion -> usuarios y productos son las opciones permitidas
    check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios','productos'])),
    check('id','El id debe ser de mongo').isMongoId(),
    validarArchivoSubir,
    validarCampos,
], actualizarImagenCloudinary);
//actualizarImagen); 

router.get('/:coleccion/:id',[
    check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios','productos'])),
    check('id','El id debe ser de mongo').isMongoId(),
    validarCampos,
],mostarImagen)

module.exports = router;