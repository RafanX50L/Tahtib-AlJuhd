export interface IUser{
    _id: string,
    name: string,
    email: string,
    password: string,
    status: "active" | "blocked",
    role: "client" | "trainer" | "admin"
}