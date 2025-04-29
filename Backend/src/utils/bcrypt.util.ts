import bcrypt from "bcryptjs";

export async function hashPassword(value: string): Promise<string> {
  const salt = 10;
  return await bcrypt.hash(value, salt);
}

export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
