async function registerFormHandler(event){
    event.preventDefault();

    const username = document.querySelector('#register-username').value.trim();
    const email = document.querySelector('#register-email').value.trim();
    const password = document.querySelector('#register-pw').value.trim();
    if(username && email && password){
        const response = await fetch('/api/users', {
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        })
        if(response.ok){
            window.location.replace('/')
            console.log('success');
        }
        else{
            alert(response.statusText);
        }
    }
}
async function loginFormHandler(event){
    event.preventDefault();

    const username = document.querySelector('#login-username').value.trim();
    const password = document.querySelector('#login-pw').value.trim();

    if(username && password){
        const response = await fetch('/api/users/login', {
            method: 'post',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });
        if(response.ok){
            window.location.replace('/');
        }
    }
}

document.querySelector('#register-form').addEventListener('submit', registerFormHandler);
document.querySelector('#login-form').addEventListener('submit', loginFormHandler);