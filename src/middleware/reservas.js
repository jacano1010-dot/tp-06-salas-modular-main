const sucursalesPermitidas = [
  "Sucursal Centro",
  "Sucursal Sur",
  "Sucursal Norte",
];

const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Turnos del gimnasio";
  next();
}

function validarReserva(req, res, next) {
  const estudiante = String(req.body.estudiante || "").trim();
  const email = String(req.body.email || "").trim();
  const sucursal = String(req.body.sucursal || "").trim();
  const fecha = String(req.body.fecha || "").trim();
  const turno = String(req.body.turno || "").trim();
  const personas = Number(req.body.personas);

  const errores = [];

  if (!estudiante) {
    errores.push("El nombre del socio es obligatorio.");
  }

  if (!email) {
    errores.push("El email es obligatorio.");
  } else if (!email.includes("@")) {
    errores.push("El email debe contener @.");
  }

  if (!sucursal) {
    errores.push("La sucursal es obligatoria.");
  } else if (!sucursalesPermitidas.includes(sucursal)) {
    errores.push("La sucursal seleccionada no es válida.");
  }

  if (!fecha) {
    errores.push("La fecha es obligatoria.");
  }

  if (!turno) {
    errores.push("El turno es obligatorio.");
  } else if (!turnosPermitidos.includes(turno)) {
    errores.push("El turno seleccionado no es válido.");
  }

  if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6."
    );
  }

  if (errores.length > 0) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nuevo turno",
      errores,
      valores: {
        estudiante,
        email,
        sucursal,
        fecha,
        turno,
        personas: req.body.personas || "",
      },
      sucursalesPermitidas,
      turnosPermitidos,
    });
  }

  req.reservaValidada = {
    estudiante,
    email,
    sucursal,
    fecha,
    turno,
    personas,
  };

  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
  sucursalesPermitidas,
  turnosPermitidos,
};
