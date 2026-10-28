const express = require("express");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

const crearRouterReservas = require("./rutas/reservas");

function crearApp({ controladorReservas, formatoMorgan }) {
  const app = express();

  app.use(morgan(formatoMorgan));
  app.use(identificarSolicitud);
  app.use(medirDuracion);

  app.use(expressLayouts);
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.set("view engine", "ejs");
  app.set("views", "./views");
  app.set("layout", "layouts/main");

  app.get("/", controladorReservas.inicio);

  app.get("/estado", controladorReservas.estado);

  const reservasRouter = crearRouterReservas(controladorReservas);

  app.use("/reservas", reservasRouter);

  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  return app;
}

module.exports = crearApp;
