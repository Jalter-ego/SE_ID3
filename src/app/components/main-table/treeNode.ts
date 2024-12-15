import { Tabla } from '../Tabla';

export interface TreeNode {
  name: string; // Nombre del nodo (columnaMayor o nombre del atributo)
  tables?: Tabla[]; // Tablas asociadas al nodo
  children?: TreeNode[]; // Hijos del nodo
}
