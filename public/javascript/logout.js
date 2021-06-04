async function logout(){
    const response = await fetch('api/users/logout', {
        method: 'post',
        headers: {'Content-Type': 'application/json'}
    });
    if (!response.ok){
        alert(response.statusText);

    }
    window.location.replace('/');
}
document.querySelector('#logout').addEventListener('click', logout);