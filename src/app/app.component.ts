import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MainTableComponent } from './components/main-table/main-table.component';
import { NgFor, NgIf } from '@angular/common';
import { Tabla } from './components/Tabla';
import { TreeNode } from './components/main-table/treeNode';
import { TreeNodeComponent } from './components/tree-node.component';
import { error } from 'node:console';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MainTableComponent, NgIf, NgFor, TreeNodeComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'proyect_id3';
  mayGanancia: string = '';
  rootNode: TreeNode | null = null;
  currentNode: TreeNode | null = null;
  pregunta: string = '';
  respuesta: string = '';
  ganancias: { [key: string]: number } = {};
  columnas: string[] = [];
  filas: string[] = [];
  index: number = 0;
  tablaActual: Tabla | undefined;
  modalVisible: boolean = false; 
  modalMessage: string = '';

  @ViewChild(MainTableComponent) mainTable!: MainTableComponent;

  async ngAfterViewInit() {
    console.log(this.mainTable.EG);
    this.tablaActual = this.mainTable.tablaInicial;
  }

  iniciarID3() {
    this.mainTable.calcularEntropias();
    const columnaMayor = this.mainTable.mayorGanancia();
    this.mayGanancia = columnaMayor;
    this.filas = this.nuevasFilas(this.mainTable.tablaInicial);
    this.index++;
    const root: TreeNode = {
      name: columnaMayor,
      children: [],
    };
    switch (columnaMayor) {
      case 'moroso':
        let datos = ['Si', 'No'];
        this.insertarTablas(datos, root);
        this.pregunta = 'moroso Si?';
        break;
      case 'antiguedad':
        datos = ['< 1','> 5','1 - 5']
        this.insertarTablas(datos, root)
        this.pregunta = 'antiguedad < 1?';
        break;
      case 'ingresos':
        datos = ['< 600','> 1200','600 - 1200']
        this.insertarTablas(datos, root)
        this.pregunta = 'ingresos < 600?';
        break;
      case 'trabajo':
        datos = ['Tiene', 'No-tiene'];
        this.insertarTablas(datos, root);
        this.pregunta = 'trabajo Tiene?';
        break;
    }
  }
  insertarTablas(datos: string[], root: TreeNode) {
    datos.forEach((dato) => {
      const newTable = this.generarTabla(this.mayGanancia, dato);
      const childNode: TreeNode = { name: dato, tables: [newTable] };
      root.children = root.children || [];
      root.children.push(childNode);
    });
    this.rootNode = root;
    this.currentNode = this.rootNode;
  }

  Si() {
    if (this.rootNode) {
      switch (this.mayGanancia) {
        case 'moroso':
          this.casoMoroso();

          break;
        case 'antiguedad':
          this.casoAntiguedad();

          break;
        case 'ingresos':
          this.casoIngreso();

          break;
        case 'trabajo':
          this.casoTrabajo();

          break;
      }
    }
  }
  casoTrabajo() {
    if (this.pregunta === 'trabajo Tiene?') {
      this.procesarNodo('Tiene');
    } else {
      this.procesarNodo('No-tiene');
    }
  }
  casoIngreso() {
    if (this.pregunta === 'ingresos < 600?') {
      this.procesarNodo('< 600');
    } else if (this.pregunta === 'ingresos > 1200?') {
      this.procesarNodo('> 1200');
    } else {
      console.log(this.pregunta);
      this.procesarNodo('600 - 1200');
    }
  }
  casoAntiguedad() {
    if (this.pregunta === 'antiguedad < 1?') {
      this.procesarNodo('< 1');
    } else if (this.pregunta === 'antiguedad > 5?') {
      this.procesarNodo('> 5');
    } else {
      this.procesarNodo('1 - 5');
    }
  }
  casoMoroso() {
    if (this.pregunta === 'moroso Si?') {
      this.procesarNodo('Si');
    } else {
      this.procesarNodo('No');
    }
  }
  procesarNodo(arg0: string) {
    if (!this.currentNode) {
      throw new Error('rootNode es undefined');
    }
    console.log('nodo actual:');
    console.log(this.currentNode);
    const selectNode = this.currentNode.children?.find(
      (child) => child.name === arg0
    );
    if (selectNode?.tables) {
      const selectTable = selectNode.tables[0];
      this.columnas = this.nuevasColumnas(selectTable);
      this.ganancias = this.calcularGanancias(selectTable);
      console.log(this.columnas);
      console.log(this.ganancias);
      this.mayGanancia = this.mayorGanancia();
      this.filas = this.nuevasFilas(selectTable);
      this.tablaActual = selectTable;
      this.validarEG(selectNode)
      const newChildren = this.filas.map((fila) => {
        const newTable = this.generarTabla(this.mayGanancia, fila);
        return {
          name: fila,
          tables: [newTable],
        };
      });

      selectNode.children = newChildren;
      this.currentNode = selectNode;
      this.pregunta = this.mayGanancia + ' ' + this.filas[this.index] + '?';
      this.index++;
    }
  }
  validarEG(selectNode: TreeNode) {
    if (this.tablaActual?.EG === 0) {
      const newTabla: Tabla = new Tabla(['Nodo hoja'],['vacio'])
      const newChildren = {
        name: this.mayGanancia,
        children: [],
        tables: [newTabla] 
      };
      selectNode.children = [newChildren]
      this.currentNode = selectNode
      this.modalMessage = `El proceso ha finalizado, Entropia Global(EG) es 0`;
      this.modalVisible = true; 
      throw new Error("")
    }
    if (this.tablaActual?.EG === 1) {
      const newTabla: Tabla = new Tabla(['Nodo hoja'],['vacio'])
      const newChildren = {
        name: this.mayGanancia,
        children: [],
        tables: [newTabla] 
      };
      selectNode.children = [newChildren]
      this.currentNode = selectNode
      this.currentNode = this.rootNode
      this.modalMessage = `El proceso ha finalizado, Entropia Global(EG) es 1`;
      this.modalVisible = true; 
    }
  }

  No() {
    if (this.index < this.filas.length) {
      const currentRow = this.filas[this.index];
      this.pregunta = `${this.mayGanancia} ${currentRow}?`;
      this.index++;
    }
  }

  nuevasFilas(selectTable: Tabla): string[] {
    this.index = 0;
    const uniqueValues = new Set<string>();

    selectTable.filas.forEach((row) => {
      if (row[this.mayGanancia]) {
        uniqueValues.add(row[this.mayGanancia]);
      }
    });
    console.log(Array.from(uniqueValues));
    return Array.from(uniqueValues);
  }

  mayorGanancia(): string {
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
  nuevasColumnas(selectTable: Tabla): string[] {
    const columnas: string[] = selectTable.columnas.filter(
      (columna: string) => columna !== this.mayGanancia
    );
    return columnas;
  }
  calcularGanancias(selectTable: any): { [key: string]: number } {
    this.columnas.forEach((columna) => {
      switch (columna) {
        case 'moroso':
          this.ganancias[columna] = selectTable.EMoroso();
          break;
        case 'antiguedad':
          this.ganancias[columna] = selectTable.EAntiguedad();
          break;
        case 'ingresos':
          this.ganancias[columna] = selectTable.EIngresos();
          break;
        case 'trabajo':
          this.ganancias[columna] = selectTable.ETrabajos();
          break;
      }
    });
    console.log(this.ganancias);
    return this.ganancias;
  }

  generarTabla(columnaMayor: string, dato: string): Tabla {
    if (!this.tablaActual) {
      throw new Error('tablaActual es undefined');
    }

    const columnas: string[] = this.tablaActual.columnas.filter(
      (columna) => columna !== columnaMayor
    );
    const rows: any[] = this.tablaActual.filas
      .filter((row) => row[columnaMayor] === dato)
      .map((row) => {
        // Crear una nueva fila sin la columnaMayor
        const { [columnaMayor]: _, ...filteredRow } = row;
        return filteredRow;
      });

    const tabla: Tabla = new Tabla(columnas, rows);

    return tabla;
  }

  cerrarModal() {
    this.modalVisible = false;
  }
}
