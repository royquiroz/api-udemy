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

    Usuario.find()
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            res.json(usuarios);
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
            usuario: usuarioDB
        });

    })

});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});

module.exports = app;