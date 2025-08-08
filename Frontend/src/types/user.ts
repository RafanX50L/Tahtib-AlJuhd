export interface UserInterface {
  _id: string;
  name: string;
  email: string;
  role: "client" | "admin" | "trainer";
  personalizationId: string | null;
  status?:
    | "applied"
    | "interview_scheduled"
    | "interviewed"
    | "approved"
    | "rejected"
    | null;
}
