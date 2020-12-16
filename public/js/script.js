async function logoutUser() {
    try {
        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Logging Out'
            })
        })
        if (response.ok) {
            const message = await response.text()
            console.log(message)
            window.location.href = '/login'
        } else {
            console.log('FAILURE')
        }
    } catch (error) {
        console.error(error)
    }
}

async function registerUser() {
    const userName = document.getElementById('userName').value
    const userPassword = document.getElementById('userPassword').value
    const messageBox = document.getElementById('messageBox')
    let userData = {
        userName: userName,
        userPassword: userPassword
    }
    let response = await fetch('/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    if (response.ok) {
        let result = await response.text()
        let container = document.getElementById('usersContainer')
        let userNameBox = document.getElementById('userName')
        let userPasswordBox = document.getElementById('userPassword')
        userNameBox.value = ""
        userPasswordBox.value = ""
        container.innerHTML = result
    } else {
        console.log("Something went wrong ")
        let result = await response.json()
        console.log(result.message)
    }
}