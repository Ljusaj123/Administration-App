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

  isLoading: boolean = false;
  isAuthorized: boolean = true;
  displayedColumns: string[] = ["username", "firstName", "lastName", "actions"];
  dataSource: any;

  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private httpService: HttpService, private dialog: MatDialog) {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.httpService.getAllUsers().subscribe({
      next: (results) => {
        const users = results.map((result: any) => {
          return {
            id: result.id,
            username: result.username,
            firstName: result.firstName,
            lastName: result.lastName,
          };
        });

        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginatior;
        this.dataSource.sort = this.sort;

        this.isAuthorized = true;
        this.isLoading = false;
        this.filter = "";
      },
      error: (error) => {
        if (error.status === 401 || error.status === 403) {
          this.isAuthorized = false;
          this.isLoading = false;
        }
      },
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
