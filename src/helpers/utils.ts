import * as bcrypt from 'bcryptjs';

export async function hashPasswordHelper(plainPassword: string) {
  const saltRound = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, saltRound);
}

export async function comparePasswordsHelper(
  plainPassword: string,
  password: string,
) {
  return await bcrypt.compare(plainPassword, password);
}
