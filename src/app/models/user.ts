export class User {
  username: string;
  firstname: string;
  lastname: string;
  password: string;

  public All(username: string, firstname: string, lastname: string, password: string): User  {
    this.username = username;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    return this;
  }

  public Login(username: string, password: string): User {
    this.username = username;
    this.password = password;
    return this;
  }

  public User(username: string): User {
    this.username = username;
    return this;
  }
}
