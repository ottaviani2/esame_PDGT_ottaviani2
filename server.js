const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const cookieparser = require("cookie-parser");
const http = require('http');

app.use(express.json())
app.use(bodyparser.json())
app.use(cookieparser());

//LOGIN
const cookies = new Map();

//LOIGN CON COOKIES
function attemptAuth(req){
    if(req.cookies.auth){
        if(cookies.has(req.cookies.auth)){
            const user = JSON.stringify(cookies.get(req.cookies.auth));
            console.log("Utente "+ user +" loggato via cookie");
            return true;
        }
        return false;
    }
}

//MySQL
var mysql = require('mysql');
const { response } = require('express');
const { isNull } = require('util');
const { writer } = require('repl');
var con = mysql.createConnection({
      host: 'localhost',
	  user: 'root',
	  password: '',
	  database: 'serra'
});

con.connect((error) => {
    if(!error)
        console.log("Connected!")
    else
        console.log("Connection Error")   
});

app.get('/users', (req, res) => {
    if(!attemptAuth(req)) {
		res.sendStatus(401).end();
		return;
    }
    try{
        var sql ="SELECT mail FROM `utenti`";

	    con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
            res.json(result)
        });
    } catch {
        res.status(403).send()
    }
})

app.post('/users', async (req, res) => {
    try{
        if(!req.accepts('application/json')) {
            res.sendStatus(406);
            return;
        }
        console.log("richiesta inserimento nuovo utente "+ req.body.name);

        var sql ="INSERT INTO `utenti`(`mail`, `password`) VALUES ('"+req.body.name+"',PASSWORD('"+req.body.password+"'))";

	    con.query(sql, function (err, result) {   
            if (err){console.log("errore database");throw err;}
        });
        res.status(200).send()
    } catch {
        res.status(403).send()
    }
})

app.post('/users/login', async (req, res) => {
    try{
    if(!req.accepts('application/json')) {
        res.sendStatus(406).end();
        return;
    }

    const username = req.body.name;
    const password = req.body.password;

    //genera il codice cookie
    const salt = await bcrypt.genSalt();
    const sessionId = await bcrypt.hash(password, salt);

    console.log("richiesta login "+username);

    var sql ="SELECT id, mail, password from utenti where mail = '"+username+"' AND Password = PASSWORD('"+password+"')";
    
    con.query(sql, function (err, result) {
        if (err){ 
            res.sendStatus(405).end();
            return;
        }else{
            cookies.set(sessionId,{ mail: username});
            res.cookie('auth', sessionId);
            //login.set(result[0].id, {mail: username, password: result[0].password})
            //const user = login.get(result[0].id)
            res.status(200).send('You are logged in').end()
            return;
        }     
    });
    }
    catch{
        res.sendStatus(401).end();
        return;
    }
})

//OPERAZIONI CRUD
//CREATE
app.post('/pianta', (req, res) => {
    try{
	if(!req.accepts('application/json')) {
		res.sendStatus(406).end();
		return;
    }
    if(!attemptAuth(req)) {
		res.sendStatus(401).end();
		return;
    }

    const id = req.body.id;
    const clima = req.body.clima;    
    const nome = req.body.name;
    const latin = req.body.latin;

	console.log("Recieve Post request for Pianta, name: "+nome);
    
	var sql = "INSERT INTO `tipo_pianta`(`Codice_tipo`,`Fascia_climatica`, `Nome_latino`, `Nome_comune`) VALUES ('"+id+"','"+clima+"','"+latin+"','"+nome+"')";
	
	con.query(sql, function (err, result) {
        if (err) {throw err;}
        console.log(result);
        res.sendStatus(200).end();
	});
    return;
    }
    catch{
        res.sendStatus(401).end();
    return;
    }
});

//READ
app.get('/pianta', (req, res) => {
    try{
	if(!req.accepts('application/json')) {
		res.sendStatus(406).end();
		return;
    }
    if(!attemptAuth(req)) {
		res.sendStatus(401).end();
		return;
    }

    const nome = req.body.name;

    console.log(req.headers);
	console.log("Recieve Get request for Pianta, name: "+nome);
	
	var sql = "SELECT Lotto, ubicazione.Descrizione, Quantita, (CURRENT_DATE()-Data_arrivo) AS Eta, lotto.Prezzo_vendita FROM pianta_ubicata JOIN lotto ON pianta_ubicata.Lotto = lotto.Codice_lotto JOIN tipo_pianta ON tipo_pianta.Codice_tipo = lotto.Tipo_pianta JOIN ubicazione ON pianta_ubicata.Ubicazione = ubicazione.Codice_ubicazione WHERE tipo_pianta.Nome_comune = '"+nome+"' OR tipo_pianta.Nome_latino = '"+nome+"'";
	
	con.query(sql, function (err, result) {
        if (err) {throw err;}
        if(result.length < 1){
            console.log('Empty');
            res.sendStatus(404).end();
            return;
        }
        console.log(result);
        res.set('content-type', 'application/json');
        res.send(result).end();
	});
    return;
    }
    catch{
        res.sendStatus(404).end();
    return;
    }
});

//UPDATE
app.put('/pianta/c_name', (req, res) => {
    try{
	if(!req.accepts('application/json')) {
		res.sendStatus(406).end();
		return;
    }
    if(!attemptAuth(req)) {
		res.sendStatus(401).end();
		return;
    }

    const nome = req.body.name;
    const newname = req.body.newname;

	console.log("Recieve Put request for Pianta, name: "+nome);
	var sql = "UPDATE `tipo_pianta` SET `Nome_comune`='"+newname+"' WHERE Nome_comune ='"+nome+"'";
	
	con.query(sql, function (err, result) {
        if (err) {throw err;}
        console.log(result);
        res.sendStatus(200).end();
	});
    return;
    }
    catch{
        res.sendStatus(401).end();
    return;
    }
});

//DELETE
app.delete('/pianta', (req, res) => {
    try{
	if(!req.accepts('application/json')) {
		res.sendStatus(406).end();
		return;
    }
    if(!attemptAuth(req)) {
		res.sendStatus(401).end();
		return;
    }

    const nome = req.body.name;

	console.log("Recieve Post request for Pianta, name: "+nome);
	var sql = "DELETE FROM `tipo_pianta`  WHERE Nome_comune ='"+nome+"' OR Nome_latino = '"+nome+"'";
	
	con.query(sql, function (err, result) {
        if (err) {throw err;}
        console.log(result);
        res.sendStatus(200).end();
	});
    return;
    }
    catch{
        res.sendStatus(401).end();
    return;
    }
});


//RICHIESTA ESTERNA OPENWEATHERMAP
app.get('/weather', (req, res) => {
    if(!req.accepts('application/json')) {
		res.sendStatus(406).end();
		return;
    }
    if(!attemptAuth(req)) {
		res.sendStatus(401).end();
		return;
    }
    try{
    const city = req.body.city;
    var resp = '';
        
    const options = {
        host: 'api.openweathermap.org',
        path: '/data/2.5/weather?q='+city+',it&appid=7ad91403d31e02346838138e8f0506f3&units=metric',
    };
        
    callback = function(response) {

        response.on('data', function (chunk) {
        resp += chunk;
    });
      
    //the whole response has been received, so we just print it out here
    response.on('end', function () {
        res.set('content-type', 'application/json');
        res.send(resp).end();
        console.log(resp);
    });
    }
      
    http.request(options, callback).end();
    }catch{
        res.sendStatus(401).end();
    }
})

//caricare la porta dalle variabili di ambiente di Heroku process.env.PORT
app.listen(3000, ()=>console.log("Express server is running at port no: 3000"))