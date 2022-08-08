
export function writeUserData(userID, token, username){
    localStorage.setItem( 'user' , JSON.stringify({"user_id": userID, "token": token, "username": username}))
}

export function readUserData(){
    return JSON.parse(window.localStorage.getItem('user'));
}

export function deleteUserData(){
    localStorage.removeItem('user')
}
