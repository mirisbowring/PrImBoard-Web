export class User {
  username: string;
  firstname: string;
  lastname: string;
  password: string;

  constructor(username: string, firstname: string, lastname: string, password: string) {
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
  }
}
