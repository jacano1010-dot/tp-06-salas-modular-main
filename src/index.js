const crearApp = require("./app");
const crearServicioReservas = require("./servicios/reservas");
const crearControladorReservas = require("./controladores/reservas");
const { puerto, formatoMorgan } = require("./configuracion");

const reservasIniciales = [
  {
    id: 1,
    estudiante: "Lebron Jofré",
    email: "lebronjofre25@example.com",
    sucursal: "Sucursal Centro",
    fecha: "2026-09-21",
    turno: "Mañana",
    personas: 2,
  },
  {
    id: 2,
    estudiante: "Mario Zalazar",
    email: "mariozalazar5@example.com",
    sucursal: "Sucursal Sur",
    fecha: "2026-09-22",
    turno: "Tarde",
    personas: 4,
  },
  {
    id: 3,
    estudiante: "Silvana Malebran",
    email: "silvanamalebran75@example.com",
    sucursal: "Sucursal Norte",
    fecha: "2026-09-23",
    turno: "Noche",
    personas: 3,
  },
  {
    id: 4,
    estudiante: "Ludmila Soria",
    email: "ludmisoria1012@example.com",
    sucursal: "Sucursal Centro",
    fecha: "2026-09-24",
    turno: "Tarde",
    personas: 1,
  },
];

const servicioReservas = crearServicioReservas(reservasIniciales);

const controladorReservas = crearControladorReservas(servicioReservas);

const app = crearApp({
  controladorReservas,
  formatoMorgan,
});

app.listen(puerto, () => {
  console.log(`Servidor ejecutándose en http://localhost:${puerto}`);
});
