import { Component, ViewChild } from "@angular/core";
import { HttpService } from "../../services/http-service.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ModalComponent } from "../modal/modal.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrl: "./table.component.css",
})
export class TableComponent {
  dialogOpened: boolean = false;
  filter: string = "";

  userRoles = [];
  users = [];

  isLoading: boolean = false;
  isAuthorized: boolean = true;
  displayedColumns: string[] = [
    "username",
    "firstName",
    "lastName",
    "roles",
    "actions",
  ];

  definedRoles = ["ADMIN", "DEVELOPER", "TESTER"];
  dataSource: any;
  allUsersRoles = [];

  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private httpService: HttpService, private dialog: MatDialog) {
    this.loadUsers();
    this.setTableData();
  }

  loadUsers() {
    this.isLoading = true;
    this.httpService.getAllUsers().subscribe({
      next: (results) => {
        this.users = this.users = results.map((result: any) => {
          return {
            id: result.id,
            username: result.username,
            firstName: result.firstName,
            lastName: result.lastName,
          };
        });

        this.getUsersRole();
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.isAuthorized = false;
          this.isLoading = false;
        }
      },
    });
  }

  getUsersRole() {
    this.definedRoles.map((role) => {
      this.httpService.getUsersRoles(role).subscribe({
        next: (results) => {
          this.userRoles = results.map((result: any) => {
            return { id: result.id, role: role };
          });
          this.allUsersRoles.push(...this.userRoles);

          this.setTableData();
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }

  setTableData() {
    const tableData = this.combineUserInfoAndRoles();

    this.dataSource = new MatTableDataSource(tableData);
    this.dataSource.paginator = this.paginatior;
    this.dataSource.sort = this.sort;

    this.isAuthorized = true;
    this.isLoading = false;
    this.filter = "";
  }

  combineUserInfoAndRoles() {
    return this.users.map((user: any) => {
      const role: any = this.allUsersRoles.find((r: any) => r.id === user.id);
      return role ? { ...user, role: role.role } : user;
    });
  }

  applyFilter(event: Event) {
    this.filter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }

  createUser() {
    this.openDialog("Create User", ModalComponent, "POST");
  }

  editUser(id: string) {
    this.openDialog("Edit User", ModalComponent, "PUT", id);
  }

  deleteUser(id: string) {
    this.httpService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  openDialog(title: string, component: any, request: string, id?: string) {
    const popup = this.dialog.open(component, {
      width: "330px",
      data: { title: title, id: id, request: request },
    });
    popup.afterClosed().subscribe(() => {
      this.loadUsers();
    });
  }
}
