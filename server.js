const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const bodyparser = require('body-parser');
const cookieparser = require("cookie-parser");

app.use(express.json())
app.use(bodyparser.json())
app.use(cookieparser());

//LOGIN
const login = new Map();
const cookies = new Map();

//login con cookies
function attemptAuth(req){
    //console.log("Authentication header: "+req.headers.authorization);
   
    //console.log("Cookies: "+ JSON.stringify(req.cookies.auth));
    //console.log(cookies.get(req.cookies.auth));


    if(req.cookies.auth){
        if(cookies.has(req.cookies.auth)){
            const user = JSON.stringify(cookies.get(req.cookies.auth));
            console.log("Utente "+ user +" loggato via cookie");
            return true;
        }
        return false;
    }
    /*
    if(!req.headers.authorization){
        return false;
    }
    if(!req.headers.aurthorization.startWith('Basic')){
        return false;
    }
    
    const auth = req.headers.authorization.substr(6);
    const decoded = new Buffer(auth, 'base64').toString();
    const[login, password] = decoded.split(':');
    
    console.log("Login: "+login+", password:"+password)
        .sendStatus(401)
        .end();

    */
}

function attemptLogin(mail){
    if(!logins.has(mail)){
        return false;
    }
    return true;
}

var mysql = require('mysql');
const { response } = require('express');
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
    try{
        var sql ="SELECT * FROM `utenti`";

	    con.query(sql, function (err, result) {
            if (err) throw err;
            
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
       // const salt = await bcrypt.genSalt()
        //const hashedPassword = await bcrypt.hash(req.body.password, salt)
        //console.log(salt)
        //console.log(hashedPassword)

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

//operazioni CRUD
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

	console.log("Recieve Get request for Pianta, name: "+nome);
	
	var sql = "SELECT Lotto, ubicazione.Descrizione, lotto.Quantita_arrivo, (CURRENT_DATE()-Data_arrivo) AS Eta, lotto.Prezzo_vendita FROM pianta_ubicata JOIN lotto ON pianta_ubicata.Lotto = lotto.Codice_lotto JOIN tipo_pianta ON tipo_pianta.Codice_tipo = lotto.Tipo_pianta JOIN ubicazione ON pianta_ubicata.Ubicazione = ubicazione.Codice_ubicazione WHERE tipo_pianta.Nome_comune = '"+nome+"' OR tipo_pianta.Nome_latino = '"+nome+"'";
	
	con.query(sql, function (err, result) {
        if (err) {throw err;}
		console.log(result);
	});
	
    res.sendStatus(200).end();
    return;
    }
    catch{
        res.sendStatus(401).end();
    return;
    }
	//data è un oggetto map con i dati estratti dal db
});

app.listen(3000, ()=>console.log("Express server is running at port no: 3000"))