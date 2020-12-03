const connectionUrl = 'postgres://jmznhgwqvffgat:ece2e97535be1d8552a49e57fb475521875578c57f6cf5cd1e01f8cfabdd0425@ec2-3-210-23-22.compute-1.amazonaws.com:5432/dtg7fqhpm6761'
const dbUrl = process.env.DATABASE_URL || connectionUrl
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: dbUrl, //process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const cool = require('cool-ascii-faces');
const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 5000

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => {
    res.render('pages/index')
  })
  .get('/cool', (req, res) => res.send(cool()))
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
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
