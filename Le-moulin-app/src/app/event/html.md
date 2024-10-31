<div class="jeunes-page">
    <h2 class="title">Event</h2>
    <mat-divider></mat-divider>
    <div class="top-section">
      <div class="left-container">
        <mat-form-field class="search-field">
          <mat-label>Nom Prénom</mat-label>
          <input matInput  (keyup)="applyFilter($event)" placeholder="Nom Prénom" #input>
        </mat-form-field>
  
      </div>
  
    </div>

    <mat-divider></mat-divider>
    <!-- Loading Spinner -->
    <mat-spinner *ngIf="tableLoading"></mat-spinner>
  
    <!-- Table Display -->
    <table mat-table *ngIf="!tableLoading" [dataSource]="dataSource" matSort (matSortChange)="sortTable()"
      class="mat-elevation-z8">
      <!-- Selection Column -->
      <ng-container matColumnDef="select">
        <th mat-header-cell *matHeaderCellDef class="select-column">
          <mat-checkbox (change)="$event ? toggleAllRows() : null" [checked]="selection.hasValue() && isAllSelected()"
            [indeterminate]="selection.hasValue() && !isAllSelected()" [aria-label]="checkboxLabel()">
          </mat-checkbox>
        </th>
        <td mat-cell *matCellDef="let row" class="select-column">
          <mat-checkbox (click)="$event.stopPropagation()" (change)="$event ? selection.toggle(row) : null"
            [checked]="selection.isSelected(row)" [aria-label]="checkboxLabel(row)">
          </mat-checkbox>
        </td>
      </ng-container>
  
      <!-- Dynamic Columns -->
      <ng-container *ngFor="let column of displayedColumns">
        <ng-container *ngIf="column !== 'select'" [matColumnDef]="column" class="normal-column">
          <th mat-header-cell *matHeaderCellDef class="header-cell" mat-sort-header>{{column | titlecase}}</th>
          <td mat-cell *matCellDef="let element" class="data-cell">{{element[column]}}</td>
          <!-- Call your function here for each column -->
        </ng-container>
      </ng-container>
      
      <!-- Table Rows -->
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row (click)="goToInscritPage(row.id)" *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    <mat-divider></mat-divider>
    <!-- Pagination -->
    <mat-paginator [pageSizeOptions]="[5, 10, 25, 100]" aria-label="Select page of users"></mat-paginator>
  
  
    <!-- No Data Message -->
    <div *ngIf="listOfJeunes.length === 0">
      <p>No data</p>
    </div>
  </div>