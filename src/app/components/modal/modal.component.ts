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
  errorMessage: string = "";

  constructor(
    private buildr: FormBuilder,
    private ref: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private httpService: HttpService
  ) {}

  myform = this.buildr.group({
    username: this.buildr.control("", [Validators.required]),
    firstname: this.buildr.control("", [Validators.required]),
    lastname: this.buildr.control("", [Validators.required]),
  });

  ngOnInit() {
    this.inputdata = this.data;

    if (this.inputdata.request === "PUT") {
      this.setModalData(this.inputdata.id);
      this.myform.controls.username.disable();
    }
  }

  setModalData(id: string) {
    this.httpService.getSingleUser(id).subscribe((item: any) => {
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

  saveUser() {
    if (this.inputdata.request === "POST") {
      this.createUser();
    } else {
      this.editUser();
    }
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

    this.httpService.createUser(user).subscribe({
      next: () => this.closeModal(),
      error: (error) => {
        this.errorMessage = error.error.errorMessage;
      },
    });
  }

  editUser() {
    if (this.myform.status === "INVALID") {
      this.errorMessage = "Enter required inputs";
      return;
    }
    const user = {
      firstName: this.myform.value.firstname,
      lastName: this.myform.value.lastname,
      username: this.myform.value.username,
    };

    this.httpService.updateUser(user, this.editdata.id).subscribe({
      next: () => this.closeModal(),
      error: (error) => {
        this.errorMessage = error.error.errorMessage;
      },
    });
  }

  closeModal() {
    this.ref.close();
  }

  generatePassword() {
    return Math.random().toString(36).slice(-8);
  }
}
