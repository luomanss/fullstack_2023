import bcrypt from "bcrypt";

const encrypt = async (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);

  return await bcrypt.hash(password, salt);
};

const decrypt = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export { encrypt, decrypt };