import { ChangeDetectionStrategy, Component, computed, OnInit, signal,AfterViewInit,ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {SelectionModel} from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { Jeune } from '../entities/jeune.entite';
import {MatSort, MatSortModule} from '@angular/material/sort' ;
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { Activite } from '../entities/activite.entite';
import {MatButtonModule} from '@angular/material/button';

export interface tableRow {
  id: number;
  secteur: string;
  nom: string;
  publique: string;  
}


@Component({
  selector: 'app-activite',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, MatCheckboxModule,MatSortModule, MatPaginatorModule, FormsModule, MatSidenavModule,MatFormFieldModule,ReactiveFormsModule, MatInputModule],
  providers: [SupabaseService],
  templateUrl: './activite.component.html',
  styleUrl: './activite.component.scss'
})
export class ActiviteComponent {
  dataSource: MatTableDataSource<tableRow>;
  selection : SelectionModel<tableRow>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  nomActivite = new FormControl('');
  listOfActivite: Activite[] = []
  listOfRows: tableRow[] = []

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.listOfActivite = await this.supabaseService.fetchActiviteData();
    for(let i = 0; i<this.listOfActivite.length;i++){
      let id = this.listOfActivite[i].id;
      let nom = this.listOfActivite[i].nom;
      let secteur = this.listOfActivite[i].secteur;
      let publique = "";
      if(this.listOfActivite[i].adulte == true){
        if(this.listOfActivite[i].enfant == true){
          publique = "Enfant et adultes"
        }
        else{ 
          publique = "Adultes"
        }
      }
      else{
        publique = "Enfant"
      }
      this.listOfRows.push({ id, nom, secteur, publique })
    }
    this.dataSource = new MatTableDataSource(this.listOfRows);
    this.selection = new SelectionModel<tableRow>(true); 
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  displayedColumns: string[] = ['nom', 'secteur', 'publique','select'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: tableRow): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  supprimerActivite() {
    console.log(this.selection.selected); // Access the array of selected rows
  }
  createActivite(){
    console.log(this.nomActivite.value);
  }
  goToActivitePage(id:number){
    console.log(id);
  }


}
