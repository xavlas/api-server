import bcrypt from 'bcryptjs';

export const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Le mot de passe doit contenir au moins ${minLength} caractères`);
  }
  if (!hasUpperCase) {
    errors.push('Le mot de passe doit contenir au moins une lettre majuscule');
  }
  if (!hasLowerCase) {
    errors.push('Le mot de passe doit contenir au moins une lettre minuscule');
  }
  if (!hasNumbers) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  if (!hasSpecialChar) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};