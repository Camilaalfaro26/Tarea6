'use strict';

const gastos = [
  { descripcion: 'Curso de ilustración digital', monto: 125, categoria: 'educacion' },
  { descripcion: 'Mensualidad de kickboxing', monto: 55, categoria: 'deporte' },
  { descripcion: 'Cuaderno para bocetos', monto: 18.50, categoria: 'materiales' },
  { descripcion: 'Taller de fotografía', monto: 75, categoria: 'educacion' },
  { descripcion: 'Guantes de entrenamiento', monto: 110, categoria: 'deporte' },
  { descripcion: 'Juego de pinceles', monto: 24.75, categoria: 'materiales' },
  { descripcion: 'Libro de diseño editorial', monto: 42, categoria: 'educacion' },
  { descripcion: 'Vendas para entrenamiento', monto: 12.50, categoria: 'deporte' }
];

function calcularTotal(gastos) {
  let total = 0;

  for (let indice = 0; indice < gastos.length; indice++) {
    if (typeof gastos[indice].monto !== 'number') {
      throw new Error('El monto del gasto "' + gastos[indice].descripcion + '" debe ser un número.');
    }

    if (!Number.isFinite(gastos[indice].monto)) {
      throw new Error('El monto del gasto "' + gastos[indice].descripcion + '" debe ser un número finito.');
    }

    total += gastos[indice].monto;
  }

  return total;
}

function calcularPromedio(gastos) {
  if (gastos.length === 0) {
    throw new Error('No se puede calcular el promedio: el array de gastos está vacío.');
  }

  return calcularTotal(gastos) / gastos.length;
}

function filtrarPorCategoria(gastos, categoria) {
  const gastosFiltrados = [];

  for (let indice = 0; indice < gastos.length; indice++) {
    if (gastos[indice].categoria === categoria) {
      gastosFiltrados[gastosFiltrados.length] = gastos[indice];
    }
  }

  return gastosFiltrados;
}

function obtenerMayorGasto(gastos) {
  if (gastos.length === 0) {
    return null;
  }

  let mayorGasto = gastos[0];

  for (let indice = 1; indice < gastos.length; indice++) {
    if (gastos[indice].monto > mayorGasto.monto) {
      mayorGasto = gastos[indice];
    }
  }

  return mayorGasto;
}

function clasificarGasto(monto) {
  if (monto >= 100) {
    return 'Alto';
  } else if (monto >= 50 && monto < 100) {
    return 'Medio';
  } else {
    return 'Bajo';
  }
}

function describirCategoria(categoria) {
  switch (categoria) {
    case 'educacion':
      return 'Cursos, talleres y libros para aprender.';
    case 'deporte':
      return 'Entrenamiento y equipo deportivo.';
    case 'materiales':
      return 'Materiales para crear e ilustrar.';
    default:
      return 'Gastos de una categoría no registrada.';
  }
}

function crearContadorDeAltos() {
  let contador = 0;

  // El cierre mantiene el mismo contador entre las llamadas a esta función.
  return function () {
    contador++;
    return contador;
  };
}

const esGastoAlto = (nivel) => nivel === 'Alto';

try {
  const total = calcularTotal(gastos);
  const promedio = calcularPromedio(gastos);
  const mayorGasto = obtenerMayorGasto(gastos);
  const gastosClasificados = [];
  const contarAlto = crearContadorDeAltos();
  let cantidadAltos = 0;

  for (let indice = 0; indice < gastos.length; indice++) {
    const gasto = gastos[indice];
    const nivel = clasificarGasto(gasto.monto);

    gastosClasificados[gastosClasificados.length] = {
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      categoria: gasto.categoria,
      nivel: nivel,
      descripcionCategoria: describirCategoria(gasto.categoria)
    };

    if (esGastoAlto(nivel)) {
      cantidadAltos = contarAlto();
    }
  }

  console.log('TABLA DE GASTOS CLASIFICADOS');
  console.table(gastosClasificados);

  console.log('RESULTADOS DEL INFORME');
  console.log('Total gastado: $' + total.toFixed(2));
  console.log('Promedio por gasto: $' + promedio.toFixed(2));

  if (mayorGasto !== null) {
    console.log(
      'Gasto más alto: ' + mayorGasto.descripcion +
      ' | Monto: $' + mayorGasto.monto.toFixed(2) +
      ' | Categoría: ' + mayorGasto.categoria
    );
  } else {
    console.log('No hay gastos para identificar el gasto más alto.');
  }

  console.log('Cantidad de gastos altos (montos de $100 o más): ' + cantidadAltos);

  const categoriaElegida = 'educacion';
  const gastosDeCategoria = filtrarPorCategoria(gastos, categoriaElegida);
  console.log('Gastos de la categoría "' + categoriaElegida + '":', gastosDeCategoria);

  const resumenPorCategoria = {};

  for (let indice = 0; indice < gastos.length; indice++) {
    const gasto = gastos[indice];

    if (resumenPorCategoria[gasto.categoria] === undefined) {
      resumenPorCategoria[gasto.categoria] = 0;
    }

    resumenPorCategoria[gasto.categoria] += gasto.monto;
  }

  const informe = {
    total: total,
    promedio: promedio,
    cantidadAltos: cantidadAltos,
    mayorGasto: mayorGasto,
    resumenPorCategoria: resumenPorCategoria
  };

  console.log('INFORME FINAL EN FORMATO JSON:\n' + JSON.stringify(informe, null, 2));
} catch (error) {
  console.error('Error al procesar los gastos: ' + error.message);
}

// Esta prueba es independiente del informe y captura un error esperado.
console.log('PRUEBA CONTROLADA: PROMEDIO DE UN ARRAY VACÍO');

try {
  calcularPromedio([]);
} catch (error) {
  console.error('Error controlado capturado: ' + error.message);
}
