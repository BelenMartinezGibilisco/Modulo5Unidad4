var express = require("express");
var router = express.Router();
var novedadesModel = require("../../models/novedadesModel");

router.get("/", async function (req, res, next) {

    var novedades = await novedadesModel.getNovedades();

    res.render("admin/novedades", {
    layout:"admin/layout",
    usuario: req.session.nombre,
    novedades
    });
});

router.get("/agregar", (req, res, next) => {
    res.render("admin/agregar", {
        layout: "admin/layout"
    })
});

router.post("/agregar", async (req, res, next) =>{
    try {
        if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
            await novedadesModel.insertNovedad(req.body);
            res.redirect("/admin/novedades")
        } else {
            res.render("admin/agregar", {
                layout: "admin/layout",
                error: true, message: "Debes completar todos los campos"
            })
        }
    } catch (error) {
        console.log(error)
        res.render("admin/agregar", {
            layout: "admin/layout",
            error: true, message: "No se cargó la novedad"
        });
    }
});

router.get("/eliminar/:id", async (req, res, next) => {
    var id = req.params.id;
    await novedadesModel.deleteNovedadById(id);
    res.redirect("/admin/novedades")
});

router.get("/modificar/:id", async (req, res, next) => {
    let id = req.params.id;
    let novedad = await novedadesModel.getNovedadById(id);
    res.render("admin/modificar", {
        layout: "admin/layout",
        novedad
    });
});

router.post("/modificar", async (req, res, next) => {
    try {
        let obj = {
            titulo: req.body.titulo,
            ingredientes: req.body.ingredientes,
            preparacion: req.body.preparacion 

        }

    await novedadesModel.modificarNovedadById(obj, req.body.id);
    res.redirect("/admin/novedades");
    }

    catch (error) {
        console.log(error)
        res.render("admin/modificar", {
            layout: "admin/layout",
            error: true, message: "No se modificó la novedad"
        })
    }
    })
    module.exports = router;