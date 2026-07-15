export function writeUserData(reponse_body){
    localStorage.setItem( 'user' , JSON.stringify(reponse_body))
}

export  function readUserData(){
    return JSON.parse( window.localStorage.getItem('user'));
}

export function deleteUserData(){
    localStorage.removeItem('user')
}