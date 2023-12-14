import bcrypt from 'bcryptjs';
const generateRandomPassword = (length: number = 12): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
};
const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};
const comparePasswords = async (plaintextPassword: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
    return isMatch;
};
export {
    generateRandomPassword,
    hashPassword,
    comparePasswords
}