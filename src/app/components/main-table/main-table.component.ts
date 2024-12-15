import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Tabla } from '../Tabla'; // Asegúrate de que esta clase esté implementada correctamente

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, CommonModule],
  templateUrl: './main-table.component.html',
  styleUrls: ['./main-table.component.css'], // Corrección en el nombre
})
export class MainTableComponent {
  rows: any[] = [
    {
      moroso: 'Si',
      antiguedad: '> 5',
      ingresos: '600 - 1200',
      trabajo: 'Tiene',
      creditos: 'Rechazado',
    },
    {
      moroso: 'No',
      antiguedad: '< 1',
      ingresos: '600 - 1200',
      trabajo: 'Tiene',
      creditos: 'Aceptado',
    },
    {
      moroso: 'Si',
      antiguedad: '1 - 5',
      ingresos: '> 1200',
      trabajo: 'Tiene',
      creditos: 'Rechazado',
    },
    {
      moroso: 'No',
      antiguedad: '> 5',
      ingresos: '> 1200',
      trabajo: 'No-tiene',
      creditos: 'Aceptado',
    },
    {
      moroso: 'No',
      antiguedad: '< 1',
      ingresos: '> 1200',
      trabajo: 'Tiene',
      creditos: 'Aceptado',
    },
    {
      moroso: 'Si',
      antiguedad: '1 - 5',
      ingresos: '600 - 1200',
      trabajo: 'Tiene',
      creditos: 'Rechazado',
    },
    {
      moroso: 'No',
      antiguedad: '1 - 5',
      ingresos: '> 1200',
      trabajo: 'Tiene',
      creditos: 'Aceptado',
    },
    {
      moroso: 'No',
      antiguedad: '< 1',
      ingresos: '< 600',
      trabajo: 'Tiene',
      creditos: 'Rechazado',
    },
    {
      moroso: 'No',
      antiguedad: '> 5',
      ingresos: '600 - 1200',
      trabajo: 'No-tiene',
      creditos: 'Rechazado',
    },
    {
      moroso: 'Si',
      antiguedad: '1 - 5',
      ingresos: '< 600',
      trabajo: 'No-tiene',
      creditos: 'Rechazado',
    },
  ];

  columnas: string[] = [
    'moroso',
    'antiguedad',
    'ingresos',
    'trabajo',
    'creditos',
  ];
  tablaInicial!: Tabla; // Inicializa en un método o constructor
  tablasCreadas: any[] = [];
  editarModo: boolean = false;

  ganancias: { [key: string]: number } = {};
  entropiaGlobal: number = 0;
  columnaMayorGanancia: string = '';

  EG: number;

  constructor() {
    this.tablaInicial = new Tabla(this.columnas, this.rows);
    this.EG = this.tablaInicial.calcularEntropia('creditos');
  }

  EGlobal() {
    this.EG = this.tablaInicial.calcularEntropia('creditos');
  }
  calcularEntropias() {
    this.ganancias['moroso'] = this.tablaInicial.EMoroso();
    this.ganancias['antiguedad'] = this.tablaInicial.EAntiguedad();
    this.ganancias['ingresos'] = this.tablaInicial.EIngresos();
    this.ganancias['trabajo'] = this.tablaInicial.ETrabajos();
  }

  mayorGanancia() {
    let mayor = 0;
    let col = '';
    this.columnas.forEach((columna) => {
      if (this.ganancias[columna] >= mayor) {
        mayor = this.ganancias[columna];
        col = columna;
      }
    });
    console.log(mayor);
    return col;
  }

  toggleEditMode() {
    this.editarModo = !this.editarModo;
  }

  // Función para guardar los cambios de la fila
  guardarCambios(rowIndex: number) {
    console.log('Cambios guardados:', this.rows[rowIndex]);
  }

 

}
