// fetch('/logout')
// .then(response => {
//     return response.text
// })
// .then(message =>{
//     console.log(message)
//     window.location.href = '/login'
// })

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