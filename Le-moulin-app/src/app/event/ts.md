import { ChangeDetectionStrategy, Component, ChangeDetectorRef, computed, OnInit, signal, AfterViewInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { Jeune } from '../entities/jeune.entite';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Participant } from '../entities/participant.entite';
import { Identite } from '../entities/identite.entite';
import { EventActivite } from '../entities/event.entite';

export interface tableRow {
  id: number;
  prenom: string;
  nom: string;
  present: boolean;
}



@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatCheckboxModule, MatSortModule, MatPaginatorModule, FormsModule, MatSidenavModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule,
    MatListModule,
    MatDividerModule],
  providers: [SupabaseService],
  templateUrl: './event.component.html',
  styleUrl: './event.component.scss'
})
export class EventComponent implements OnInit {

  dataSource: MatTableDataSource<tableRow>;
  selection: SelectionModel<tableRow>;

  @ViewChild(MatTable) table: MatTable<tableRow>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  eventData: EventActivite;
  tableLoading: boolean;
  listOfIdentite: Identite[] = [];
  listOfJeunes: Jeune[] = [];
  listOfRows: tableRow[] = [];
  listOfParticipant: Participant[] = [];
  id: number;

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit() {
    console.log("ngOnInit Start")
    this.tableLoading = true;
    this.listOfIdentite = await this.supabaseService.fetchIdentiteData();
    this.listOfJeunes = await this.supabaseService.fetchJeunesseData();
    this.route.params.subscribe(async (params) => {
      this.id = params['id'];
      this.eventData = await this.supabaseService.fetchEventDataById(this.id);
      this.listOfParticipant = await this.supabaseService.fetchParticipantDataByEventId(this.id);
      for(let i=0; i<this.listOfParticipant.length;i++){
        let id = this.listOfParticipant[i].identite_id.id;
        let nom = this.listOfParticipant[i].identite_id.nom;
        let prenom = this.listOfParticipant[i].identite_id.prenom;
        let present = this.listOfParticipant[i].present;
        this.listOfRows.push({id,nom,prenom,present});
      }
      this.dataSource = new MatTableDataSource(this.listOfRows);
      this.selection = new SelectionModel<tableRow>(true);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.tableLoading = false;
    })
  }
  displayedColumns: string[] = ['nom', 'prenom','present','select'];

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
  goToInscritPage(id: string) {
    console.log(id);
    for (let i = 0; i < this.listOfJeunes.length; i++) {
      if (id == this.listOfJeunes[i].identite_id.id) {
        this.router.navigate([`/jeunesse/${this.listOfJeunes[i].id}`]);
      }
    }
  }

  goBack() {
    this.router.navigate([`/activités/${this.eventData.activite_id}`]);
  }


}
