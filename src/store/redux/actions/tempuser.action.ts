export function saveUser(userId: string) {
  return {
    type: 'SAVE_USER',
    payload: userId
  };
}

export function removeUser() {
  return {
    type: 'REMOVE_USER',
  };
}
