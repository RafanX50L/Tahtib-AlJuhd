
export interface UserInterface {
    _id:string;
    name:string;
    email:string;
    role: "client" | "admin" | "trainer";
    personalization:string | null;
}