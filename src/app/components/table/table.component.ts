import { Component, ViewChild } from "@angular/core";
import { HttpService } from "../../services/http-service.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ModalComponent } from "../modal/modal.component";
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { ConfirmModalComponent } from "../confirm-modal/confirm-modal.component";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrl: "./table.component.css",
})
export class TableComponent {
  usersList = [];
  dialogOpened: boolean = false;
  dataSource: any;

  displayedColumns: string[] = ["username", "firstName", "lastName", "actions"];

  @ViewChild(MatPaginator) paginatior!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private httpService: HttpService, private dialog: MatDialog) {
    this.loadUsers();
  }

  loadUsers() {
    this.httpService.getAllUsers().subscribe((results) => {
      this.usersList = results.map((result: any) => {
        return {
          id: result.id,
          username: result.username,
          firstName: result.firstName,
          lastName: result.lastName,
        };
      });

      this.dataSource = new MatTableDataSource(this.usersList);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  createUser() {
    this.openDialog("Create User", ModalComponent);
  }

  editUser(id: string) {
    this.openDialog("Edit User", ModalComponent, id);
  }

  deleteUser(id: string) {
    this.httpService.deleteUser(id).subscribe(() => {
      this.loadUsers();
    });
  }

  openDialog(title: string, component: any, code?: any) {
    const popup = this.dialog.open(component, {
      width: "330px",
      data: { title: title, code: code },
    });
    popup.afterClosed().subscribe(() => {
      this.loadUsers();
    });
  }
}
