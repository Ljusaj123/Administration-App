import { Component, ViewChild } from "@angular/core";
import { HttpService } from "../../services/http-service.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

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

  constructor(private httpService: HttpService) {
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
}
