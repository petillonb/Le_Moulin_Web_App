import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { createClient } from '@supabase/supabase-js';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { Activité } from '../entities/activité.entite';
import {MatSort, MatSortModule} from '@angular/material/sort' ;
import {AfterViewInit , ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-activite',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, MatCheckboxModule,MatSortModule, MatPaginatorModule, FormsModule, MatSidenavModule,MatFormFieldModule, MatInputModule],
  providers: [SupabaseService],
  templateUrl: './activite.component.html',
  styleUrl: './activite.component.scss'
})
export class ActiviteComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  listOfActivite: Activité[] = []

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) { }



  displayedColumns: string[] = ['name', 'sector'];
  dataSource = new MatTableDataSource(this.listOfActivite);


}
