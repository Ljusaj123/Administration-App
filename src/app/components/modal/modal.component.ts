import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HttpService } from "../../services/http-service.service";
import { v4 as uuidv4 } from "uuid";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrl: "./modal.component.css",
})
export class ModalComponent implements OnInit {
  inputdata: any;
  editdata: any;

  constructor(
    private buildr: FormBuilder,
    private ref: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    this.inputdata = this.data;
    if (this.inputdata.code) {
      this.setModalData(this.inputdata.code);
    }
  }

  setModalData(code: any) {
    this.httpService.getSingleUser(code).subscribe((item: any) => {
      this.editdata = {
        id: item.id,
        username: item.username,
        firstName: item.firstName,
        lastName: item.lastName,
      };

      this.myform.setValue({
        username: this.editdata.username,
        firstname: this.editdata.firstName,
        lastname: this.editdata.lastName,
      });
    });
  }

  closeModal() {
    this.ref.close("some data");
  }

  generatePassword() {
    return Math.random().toString(36).slice(-8);
  }

  createUser() {
    const user = {
      id: uuidv4(),
      credentials: [
        {
          temporary: false,
          type: "password",
          value: this.generatePassword(),
        },
      ],
      firstName: this.myform.value.firstname,
      lastName: this.myform.value.lastname,
      username: this.myform.value.username,
    };

    this.httpService.createUser(user).subscribe(() => {
      this.closeModal();
    });
  }

  editUser() {
    const user = {
      firstName: this.myform.value.firstname,
      lastName: this.myform.value.lastname,
      username: this.myform.value.username,
    };

    this.httpService.updateUser(user, this.editdata.id).subscribe(() => {
      this.closeModal();
    });
  }

  saveUser() {
    if (this.inputdata.title === "Create User") {
      this.createUser();
    } else {
      this.editUser();
    }
  }

  myform = this.buildr.group({
    username: this.buildr.control(" ", Validators.required),
    firstname: this.buildr.control(" ", Validators.required),
    lastname: this.buildr.control(" ", Validators.required),
  });
}
