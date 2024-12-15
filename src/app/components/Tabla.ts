export class Tabla {
  columnas: string[];
  filas: any[];
  EG: number;

  constructor(columnas: string[], filas: any[]) {
    this.columnas = columnas;
    this.filas = filas;
    this.EG = this.calcularEntropia('creditos');
  }

  contarFrecuencias(columna: string) {
    const frecuencias: { [key: string]: number } = {};
    this.filas.forEach((fila) => {
      frecuencias[fila[columna]] = (frecuencias[fila[columna]] || 0) + 1;
    });
    return frecuencias;
  }

  // Método para calcular la entropía(solo de credito)
  calcularEntropia(columna: string) {
    const total = this.filas.length;
    const frecuencias = this.contarFrecuencias(columna);
    let entropia = 0;

    Object.values(frecuencias).forEach((freq) => {
      const p = freq / total;
      if (p > 0) {
        entropia -= p * Math.log2(p);
      }
    });

    return entropia;
  }

  EMoroso() {
    const total = this.filas.length;
    const frecuenciasMoroso: { [key: string]: number } = { Sí: 0, No: 0 };
    this.filas.forEach((row) => {
      frecuenciasMoroso[row.moroso]++;
    });
    let EMorosoSi = 0;
    let EMorosoNo = 0;

    // Para "Sí"
    const Fsi = this.filas.filter(
      (row) => row.moroso === 'Sí' && row.creditos === 'Rechazado'
    ).length;
    const Dsi = this.filas.filter(
      (row) => row.moroso === 'Sí' && row.creditos === 'Aceptado'
    ).length;
    const Csi = frecuenciasMoroso['Sí'];

    if (Csi > 0) {
      if (Fsi > 0) {
        EMorosoSi -= (Fsi / Csi) * Math.log2(Fsi / Csi);
      }
      if (Dsi > 0) {
        EMorosoSi -= (Dsi / Csi) * Math.log2(Dsi / Csi);
      }
    }

    // Para "No"
    const Fno = this.filas.filter(
      (row) => row.moroso === 'No' && row.creditos === 'Rechazado'
    ).length;
    const Dno = this.filas.filter(
      (row) => row.moroso === 'No' && row.creditos === 'Aceptado'
    ).length;
    const Cno = frecuenciasMoroso['No'];

    if (Cno > 0) {
      if (Fno > 0) {
        EMorosoNo -= (Fno / Cno) * Math.log2(Fno / Cno);
      }
      if (Dno > 0) {
        EMorosoNo -= (Dno / Cno) * Math.log2(Dno / Cno);
      }
    }
    let entropiaMoroso = (Cno / total) * EMorosoNo + (Csi / total) * EMorosoSi;
    return this.EG - entropiaMoroso;
  }

  EAntiguedad() {
    const total = this.filas.length;

    const categorias = ['< 1', '1 - 5', '> 5'];
    let entropiaAntiguedad = 0;

    categorias.forEach((categoria) => {
      const C = this.filas.filter((row) => row.antiguedad === categoria).length;

      if (C > 0) {
        let entropiaCategoria = 0;
        const F = this.filas.filter(
          (row) => row.antiguedad === categoria && row.creditos === 'Rechazado'
        ).length;
        const D = this.filas.filter(
          (row) => row.antiguedad === categoria && row.creditos === 'Aceptado'
        ).length;
        if (F > 0) entropiaCategoria -= (F / C) * Math.log2(F / C);
        if (D > 0) entropiaCategoria -= (D / C) * Math.log2(D / C);
        entropiaAntiguedad += (C / total) * entropiaCategoria;
      }
    });
    return this.calcularEntropia('creditos') - entropiaAntiguedad;
  }

  EIngresos() {
    const total = this.filas.length;
    const categorias = ['< 600', '600 - 1200', '> 1200'];
    let entropiaIngresos = 0;

    categorias.forEach((categoria) => {
      const C = this.filas.filter((row) => row.ingresos === categoria).length;

      if (C > 0) {
        let entropiaCategoria = 0;
        const F = this.filas.filter(
          (row) => row.ingresos === categoria && row.creditos === 'Rechazado'
        ).length;
        const D = this.filas.filter(
          (row) => row.ingresos === categoria && row.creditos === 'Aceptado'
        ).length;

        if (F > 0) entropiaCategoria -= (F / C) * Math.log2(F / C);
        if (D > 0) entropiaCategoria -= (D / C) * Math.log2(D / C);
        entropiaIngresos += (C / total) * entropiaCategoria;
      }
    });

    return this.calcularEntropia('creditos') - entropiaIngresos;
  }

  ETrabajos() {
    const total = this.filas.length;
    const categorias = ['Tiene', 'No-tiene'];
    let entropiaTrabajos = 0;

    categorias.forEach((categoria) => {
      const C = this.filas.filter((row) => row.trabajo === categoria).length;

      if (C > 0) {
        let entropiaCategoria = 0;
        const F = this.filas.filter(
          (row) => row.trabajo === categoria && row.creditos === 'Rechazado'
        ).length;
        const D = this.filas.filter(
          (row) => row.trabajo === categoria && row.creditos === 'Aceptado'
        ).length;

        if (F > 0) entropiaCategoria -= (F / C) * Math.log2(F / C);
        if (D > 0) entropiaCategoria -= (D / C) * Math.log2(D / C);
        entropiaTrabajos += (C / total) * entropiaCategoria;
      }
    });
    return this.calcularEntropia('creditos') - entropiaTrabajos;
  }
}
