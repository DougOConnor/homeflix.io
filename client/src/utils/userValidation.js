
function validateUsername(username) {
  const minLength = 4;
  if (!username) {
    return 'Username is required';
  }
  if (username.length < minLength) {
    return 'username must be at least ' + minLength.toString() + ' characters';
  }
  return '';
}

export function isUsernameValid(username){
    const error = validateUsername(username);
    if (error == ""){
        return true;
    } else {
        return false;
    }
}

export function getUsernameError(username){
    const error = validateUsername(username);
    return error;
}

function validatePassword(password, confirmPassword) {
  const minLength = 8;
  if (!password) {
    return 'Password is required';
  }
  if (password.length < minLength) {
    return 'password must be at least ' + minLength.toString() + ' characters';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
}

export function isPasswordValid (password, confirmPassword) {
    const error = validatePassword(password, confirmPassword);
    if (error == ""){
        return true;
    } else {
        return false;
    }
}

export function getPasswordError (password, confirmPassword) {
    const error = validatePassword(password, confirmPassword);
    return error;
}
