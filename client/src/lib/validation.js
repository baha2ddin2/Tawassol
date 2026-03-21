/**
 * Centralized frontend validation for all forms.
 * Returns an object of { field: errorMessage } or null if valid.
 */

export function validateEmail(email) {
  if (!email || !email.trim()) return "This field is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Please enter a valid email address";
  return null;
}

export function validatePassword(password) {
  if (!password) return "This field is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

export function validateName(name) {
  if (!name || !name.trim()) return "This field is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  if (name.trim().length > 50) return "Name must be less than 50 characters";
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) return "This field is required";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
}

export function validateGroupName(name) {
  if (!name || !name.trim()) return "Group name is required";
  if (name.trim().length < 2) return "Group name must be at least 2 characters";
  return null;
}

export function validateMessageContent(content, files = []) {
  if ((!content || !content.trim()) && files.length === 0) {
    return "Message cannot be empty";
  }
  return null;
}

export function validatePostContent(content, files = []) {
  if ((!content || !content.trim()) && files.length === 0) {
    return "Post content or media is required";
  }
  return null;
}

/**
 * Validate an entire login form.
 * @returns {{ email?: string, password?: string } | null}
 */
export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Validate an entire register form.
 * @returns {{ name?: string, email?: string, password?: string, confirm_password?: string } | null}
 */
export function validateRegisterForm({ name, email, password, confirmPassword }) {
  const errors = {};
  const nameErr = validateName(name);
  const emailErr = validateEmail(email);
  const passErr = validatePassword(password);
  const confirmErr = validateConfirmPassword(password, confirmPassword);
  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (passErr) errors.password = passErr;
  if (confirmErr) errors.confirm_password = confirmErr;
  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Validate change password form.
 */
export function validateChangePasswordForm({ currentPassword, newPassword, confirmPassword }) {
  const errors = {};
  if (!currentPassword) errors.currentPassword = "Current password is required";
  const passErr = validatePassword(newPassword);
  if (passErr) errors.newPassword = passErr;
  const confirmErr = validateConfirmPassword(newPassword, confirmPassword);
  if (confirmErr) errors.confirmPassword = confirmErr;
  return Object.keys(errors).length > 0 ? errors : null;
}

/**
 * Validate change email form.
 */
export function validateChangeEmailForm({ email, password }) {
  const errors = {};
  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;
  if (!password) errors.password = "Password is required for verification";
  return Object.keys(errors).length > 0 ? errors : null;
}
