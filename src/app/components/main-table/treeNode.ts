import { Tabla } from '../Tabla';

export interface TreeNode {
  name: string; 
  tables?: Tabla[]; 
  children?: TreeNode[];
}
