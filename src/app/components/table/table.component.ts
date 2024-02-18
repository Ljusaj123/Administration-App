import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../services/http-service.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { OAuthService, UrlHelperService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [OAuthService, UrlHelperService],
})
export class TableComponent {
  filter: string = '';
  users: User[] = [];

  isLoading: boolean = false;
  displayedColumns: string[] = ['username', 'firstName', 'lastName', 'actions'];

  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private httpService: HttpService,
    private dialog: MatDialog,
    private authservice: OAuthService
  ) {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.httpService.getAllUsers().subscribe({
      next: (results): void => {
        this.users = results.map((result: any) => {
          return {
            id: result.id,
            username: result.username,
            firstName: result.firstName,
            lastName: result.lastName,
          };
        });
        this.setTableData();
      },
      error: (error): void => {
        if (
          error.status === 401 ||
          error.status === 403 ||
          error.status === 0
        ) {
          //Refresh token
        }
      },
      complete: (): void => {
        this.isLoading = false;
      },
    });
  }

  setTableData() {
    this.dataSource.data = this.users;
    this.dataSource.paginator = this.paginatior;
    this.dataSource.sort = this.sort;
    this.filter = '';
  }

  applyFilter(event: Event) {
    this.filter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  createUser() {
    this.openDialog('Create User', 'POST');
  }

  editUser(id: string) {
    this.openDialog('Edit User', 'PUT', id);
  }

  deleteUser(id: string) {
    this.httpService.deleteUser(id).subscribe({
      next: (): void => {
        this.loadUsers();
      },
      error: (error): void => {
        console.log(error);
      },
    });
  }

  openDialog(title: string, request: string, id?: string) {
    const popup = this.dialog.open(ModalComponent, {
      width: '330px',
      data: { title, id, request },
    });
    popup.afterClosed().subscribe(() => {
      this.loadUsers();
    });
  }
}
