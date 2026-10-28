const sucursalesPermitidas = [
  "Sucursal Centro",
  "Sucursal Sur",
  "Sucursal Norte",
];

const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function crearServicioReservas(datosIniciales) {
  const reservas = [...datosIniciales];

  let siguienteId =
    reservas.length > 0
      ? Math.max(...reservas.map((reserva) => reserva.id)) + 1
      : 1;

  function listar() {
    return reservas;
  }

  function buscarPorId(id) {
    return reservas.find((reserva) => reserva.id === id);
  }

  function contar() {
    return reservas.length;
  }

  function crear(datos) {
    const nuevaReserva = {
      id: siguienteId,
      ...datos,
    };

    reservas.push(nuevaReserva);
    siguienteId++;

    return nuevaReserva;
  }

  function obtenerSucursalesPermitidas() {
    return sucursalesPermitidas;
  }

  function obtenerTurnosPermitidos() {
    return turnosPermitidos;
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
    obtenerSucursalesPermitidas,
    obtenerTurnosPermitidos,
  };
}

module.exports = crearServicioReservas;
