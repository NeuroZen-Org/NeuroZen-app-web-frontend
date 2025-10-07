export class User {
  constructor({ id, email, password, name, role = 'user', createdAt }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.role = role;
    this.createdAt = createdAt || new Date().toISOString();
  }

  static fromApiResponse(data) {
    return new User(data);
  }

  toApiPayload() {
    return {
      email: this.email,
      password: this.password,
      name: this.name,
      role: this.role
    };
  }

  isAdmin() {
    return this.role === 'admin';
  }
}
