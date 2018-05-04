const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();

const Usuario = require('../models/usuario')


app.get('/usuario', function(req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email estado role google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

        Usuario.count({ estado: true }, (err, cont) =>{

            res.json({
                ok: true,
                usuarios,
                total: cont
            });

        })
    })

});

//Method POST para la carga de usuarios
app.post('/usuario', function(req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        usuarioDB.password = undefined;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'img', 'estado']);
    let options = {
        new: true,
        runValidations: true
    }

    Usuario.findByIdAndUpdate( id, body, options, (err, usuarioDB) => {
        
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        usuarioDB.password = undefined;

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;
    let estado = { estado: false }
    let options = {
        new: true,
        runValidations: true
    }

    Usuario.findByIdAndUpdate(id, estado, options, (err, usuarioDelete) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuarioDelete.estado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: `Usuario con el id ${id} ya ha sido eliminado`
                }
            })
        }

        res.json({
            ok: true,
            usuarioDelete
        });

    })

    /*
    Usuario.findByIdAndRemove(id, (err, usuario) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if(!usuario){
            return res.status(400).json({
                ok: false,
                err: {
                    message: `Usuario con el id ${id} no encontrado dentro de la base de datos`
                }
            })
        }

        res.json({
            ok: true,
            usuario
        });

    })
    */

});

module.exports = app;