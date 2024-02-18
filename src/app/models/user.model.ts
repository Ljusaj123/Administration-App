export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}

export interface ModalInput {
  title: string;
  id: string;
  request: string;
}

export interface NewUser extends User {
  credentials: [
    {
      temporary: boolean;
      type: string;
      value: string;
    }
  ];
  enabled: boolean;
}
