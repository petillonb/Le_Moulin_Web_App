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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';

export interface tableRow {
  id: number;
  secteur: string;
  nom: string;
  publique: string;  
}


@Component({
  selector: 'app-activite',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule,MatProgressSpinnerModule, MatCheckboxModule,MatSortModule, MatPaginatorModule, FormsModule, MatSidenavModule,MatFormFieldModule,ReactiveFormsModule, MatInputModule,MatButtonModule,
    MatListModule, 
    MatDividerModule],
  providers: [SupabaseService],
  templateUrl: './activite.component.html',
  styleUrl: './activite.component.scss'
})
export class ActiviteComponent {
  dataSource: MatTableDataSource<tableRow>;
  selection : SelectionModel<tableRow>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  tableLoading: boolean;

  nomActivite = new FormControl('');
  listOfActivite: Activite[] = []
  listOfRows: tableRow[] = []

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.tableLoading = true;
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
    this.tableLoading = false;
  }

  displayedColumns: string[] = ['nom', 'secteur', 'publique','select'];

  sortTable() {
    this.dataSource.sort = this.sort; // This line should trigger the sorting
  }

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
  async supprimerActivite() {
    this.tableLoading = true;
    console.log(this.selection.selected); // Access the array of selected rows

    for(let i = 0; i<this.selection.selected.length; i++){
      let eventList = await this.supabaseService.fetchEventDataByActiviteId(this.selection.selected[i].id)
      for(let j = 0; j<eventList.length; j++){
        let participantList = await this.supabaseService.fetchParticipantDataByEventId(eventList[j].id)
        for(let k = 0; k<participantList.length; k++){
          await this.supabaseService.supprimerParticipantData(participantList[k].id);
        }
        await this.supabaseService.supprimerEventData(eventList[j].id);
      }
      await this.supabaseService.supprimerActiviteData(this.selection.selected[i].id);
      for(let j= 0; j<this.dataSource.data.length; j++){
        if (this.dataSource.data[j].id == this.selection.selected[i].id) {
          this.dataSource.data.splice(j, 1);
          this.dataSource.filter = "";
          console.log(this.dataSource.data);
        }
        
      }

    }

    this.tableLoading = false;
  }
  async createActivite(){
    console.log(this.nomActivite.value);
    if(this.nomActivite.value){
      let nouvelleActivite: Activite = {
        id: null,
        nom: this.nomActivite.value,
        secteur: null,
        enfant: true,
        adulte: false,
      }
      nouvelleActivite = await this.supabaseService.insertActiviteData(nouvelleActivite);
      console.log(nouvelleActivite.id);
      this.router.navigate([`/activités/${nouvelleActivite.id}`]);
      

    }
  }
  goToActivitePage(id:number){
    this.router.navigate([`/activités/${id}`]);
  }


}
