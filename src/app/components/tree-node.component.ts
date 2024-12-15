import { Component, Input } from '@angular/core';
import { TreeNode } from './main-table/treeNode';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-tree-node',
    standalone: true,
    imports: [NgFor, NgIf],
    template: `
      <div class="node">
        <h3>{{ node.name }}</h3>
  
        <!-- Renderizar tablas del nodo -->
        <div *ngFor="let table of node.tables">
          <!-- Limitar ancho de la tabla y ajustar el layout -->
          <table class="table-auto w-full border border-gray-300 border-collapse text-left overflow-hidden sm:text-sm" style="max-width: 400px;">
            <thead>
              <tr class="border-b border-gray-300 hover:bg-gray-50">
                <!-- Controlar el ancho de las columnas -->
                <th *ngFor="let column of table.columnas" class="p-1 text-gray-600 font-semibold border-r border-gray-300 text-sm" style="width: 150px;">{{ column }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let row of table.filas" class="border-b border-gray-300 hover:bg-gray-50">
                <td *ngFor="let key of table.columnas" class="p-1 border-r border-gray-300 sm:text-sm" style="max-width: 150px; overflow: hidden; text-overflow: ellipsis;">{{ row[key] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <!-- Renderizar hijos -->
        <div *ngIf="node.children && node.children.length > 0" class="children">
          <app-tree-node *ngFor="let child of node.children" [node]="child"></app-tree-node>
        </div>
      </div>
    `,
    styles: [
      `
        .node {
          margin-left: 20px;
          border-left: 2px solid #ccc;
          padding-left: 10px;
        }
      `,
    ],
  })
  export class TreeNodeComponent {
    @Input() node!: TreeNode;
  }
  