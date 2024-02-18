import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpService } from '../../services/http-service.service';
import { v4 as uuidv4 } from 'uuid';
import { ModalInput, NewUser, User } from '../../models/user.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  inputdata: ModalInput;
  id!: string;
  errorMessage: string = '';

  constructor(
    private buildr: FormBuilder,
    private ref: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalInput,
    private httpService: HttpService
  ) {
    this.inputdata = data;
  }

  ngOnInit() {
    if (this.inputdata.request === 'PUT') {
      this.setModalData(this.inputdata.id);
      this.myform.controls.username.disable();
    }
  }

  setModalData(id: string) {
    this.httpService.getSingleUser(id).subscribe((item: any) => {
      this.myform.setValue({
        username: item.username,
        firstname: item.firstName,
        lastname: item.lastName,
      });
      this.id = item.id;
    });
  }

  saveUser() {
    if (this.myform.status === 'INVALID') {
      this.errorMessage = 'Enter required inputs';
      return;
    }
    if (this.inputdata.request === 'POST') {
      this.createUser();
    } else {
      this.editUser();
    }
  }

  createUser() {
    const password = this.generatePassword();
    const user: NewUser = {
      id: uuidv4(),
      credentials: [
        {
          temporary: false,
          type: 'password',
          value: password,
        },
      ],
      firstName: this.myform.value.firstname!,
      lastName: this.myform.value.lastname!,
      username: this.myform.value.username!,
      enabled: true,
    };

    this.httpService.createUser(user).subscribe({
      next: () => this.closeModal(),
      error: (error) => {
        this.errorMessage = error.error.errorMessage;
      },
      complete: () => {
        alert(`Generated password is ${password}`);
      },
    });
  }

  editUser() {
    const user: User = {
      firstName: this.myform.value.firstname!,
      lastName: this.myform.value.lastname!,
      username: this.myform.value.username!,
      id: this.id,
    };

    this.httpService.updateUser(user).subscribe({
      next: () => this.closeModal(),
      error: (error) => {
        this.errorMessage = error.error.errorMessage;
      },
    });
  }

  closeModal() {
    this.ref.close();
  }

  generatePassword(): string {
    return Math.random().toString(36).slice(-8);
  }

  myform = this.buildr.group({
    username: this.buildr.control('', [Validators.required]),
    firstname: this.buildr.control('', [Validators.required]),
    lastname: this.buildr.control('', [Validators.required]),
  });
}
