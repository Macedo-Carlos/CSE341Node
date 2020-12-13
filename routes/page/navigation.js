const connectionUrl = 'postgres://jmznhgwqvffgat:ece2e97535be1d8552a49e57fb475521875578c57f6cf5cd1e01f8cfabdd0425@ec2-3-210-23-22.compute-1.amazonaws.com:5432/dtg7fqhpm6761'
const dbUrl = process.env.DATABASE_URL || connectionUrl
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const request = require('request')
const { Pool } = require('pg');
const { response } = require('express')
const pool = new Pool({
  connectionString: dbUrl, //process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});


router
    .get('/', checkAuth, (req, res) => {
        if (req.session.userIsAdmin) {
            res.render('pages/dashboard_a', {
                userName: req.session.userName,
                userIsAdmin: req.session.userIsAdmin
            })
        } else {
            res.render('pages/dashboard_b', {
                userName: req.session.userName,
                userIsAdmin: req.session.userIsAdmin
            })
        }
    })
    .get('/login', checkNotAuth, (req, res) => {
        res.render('pages/login') 
    })
    .post('/login', checkNotAuth, async (req, res, next) => {
        const userName = req.body.userName
        const userPassword = req.body.userPassword
        try {
            const client = await pool.connect()
            const results = await client.query('SELECT * FROM users WHERE user_name = $1', [userName])
            if (results.rowCount === 0) {
                return res.render('pages/login', {
                    message: 'The user name you entered is incorrect. Please try again.' 
                })
            }
            const result = results.rows[0]
            const hashedPassword =result.user_password
            const userIsAdmin = result.user_is_admin
            const verified = await bcrypt.compare(userPassword, hashedPassword)
            client.release();
            if (verified) {
                req.session.isLoggedIn = 'true'
                req.session.userName = userName
                req.session.userIsAdmin = userIsAdmin
                res.redirect('/')
            } else {
                res.render('pages/login', {
                message: 'The password you entered is incorrect. Please try again.'
                })
            }
        } catch(err) {
            console.log(err.stack) 
        }
    })
    .get('/logout',checkAuth, (req, res) => {
        req.session.destroy()
        res.render('pages/login')
    })
    .post('/logout', checkAuth, (req, res) => {
        req.session.destroy()
        res.status(200).send('User logged out')
    })
    .get('/users', checkAuth, async (req, res) => {
        const results = await getUsersList()
        res.render('pages/users', {
                results: results
        })
    })
    .post('/users/register', checkAuth, async (req, res) => {
        const userName = req.body.userName
        const userPassword = req.body.userPassword
        const hashedPassword = await bcrypt.hash(userPassword, 10)
        try {
            const client = await pool.connect()
            const result = await client.query('INSERT INTO users (user_name, user_password, user_is_admin) VALUES ($1, $2, $3) RETURNING id', [userName, hashedPassword, 'false'])
            client.release()
            res.send(result.rows)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'The user could not be created'})
        }
    }) //Database tester
    .get('/db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM test_table');
        const results = { 'results': (result) ? result.rows : null};
        res.render('pages/db', results );
        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err); 
    }
    }) // Password tester
    .get('/password_tester', async (req, res) => {
        const hashedPassword = await bcrypt.hash('password', 10)
        const verified = await bcrypt.compare('password', hashedPassword)
        console.log(verified)
        res.send(verified)
    })
    

function checkAuth(req, res, next) {
    if (!req.session.isLoggedIn || req.session.isLoggedIn === 'false') {
        res.redirect('/login')
    } else {
        next()
    }
}

function checkNotAuth(req, res, next) {
    if (!req.session.isLoggedIn || req.session.isLoggedIn === 'false') {
        return next()
    } else {
        res.redirect('/')
    }
}

async function getUsersList() {
    try {
        const client = await pool.connect()
        const results = await client.query('SELECT * FROM users')
        client.release()
        if (results.rowCount === 0) {
            res.send('There are no users registered')
        }
        return results.rows
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'The user list is not available. Please try again.'})
    }
}

module.exports = router



// function googleAPI(req, res) {
//     search = req.body.search
//     select = req.body.select
//     request("https://www.googleapis.com/books/v1/volumes?q=" + select + search , { json: true }, (err, response, data) => {
//       if (err) { return console.log(err) }
//       console.log(data)
//       res.json(data)
//     })
// }