function crearControladorReservas(servicio) {
  function inicio(req, res) {
    res.render("inicio", {
      titulo: "Turnos del gimnasio",
    });
  }

  function estado(req, res) {
    res.json({
      servicio: "activo",
      reservas: servicio.contar(),
      solicitudId: res.locals.solicitudId,
    });
  }

  function listar(req, res) {
    res.render("reservas/lista", {
      titulo: "Turnos registrados",
      reservas: servicio.listar(),
    });
  }

  function nueva(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nuevo turno",
      errores: [],
      valores: {},
      sucursalesPermitidas: servicio.obtenerSucursalesPermitidas(),
      turnosPermitidos: servicio.obtenerTurnosPermitidos(),
    });
  }

  function detalle(req, res) {
    const id = Number(req.params.id);
    const reserva = servicio.buscarPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Turno no encontrado",
        mensaje: "El turno solicitado no existe.",
      });
    }

    res.render("reservas/detalle", {
      titulo: "Detalle del turno",
      reserva,
    });
  }

  function crear(req, res) {
    servicio.crear(req.reservaValidada);

    res.redirect("/reservas");
  }

  return {
    inicio,
    estado,
    listar,
    nueva,
    detalle,
    crear,
  };
}

module.exports = crearControladorReservas;
