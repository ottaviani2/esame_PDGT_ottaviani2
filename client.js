var http = require('follow-redirects').http;
//const http = require('http');
var request = require('request');

var menuHandler;

const HOST = 'localhost';
const PORT = '3000';
const user = "fra.otto@hotmail.com";
const passw = "password";
const cookies = new Map();

var my_cookie = '';
var cookie = '';

// Main
function Initialize() {
  login();
  Menu();
  process.stdin.setEncoding('utf8');
  process.stdin.on('readable', checkMenu);

  function checkMenu() {
    var input = process.stdin.read();
    if(input !== null) {
      menuHandler(input.trim());
    }
  }
}

function Menu(){
  console.log(
      '1. lista utenti' + '\n' +
      '2. richiesta parametri ambientali a servizio esterno' + '\n' +
      '3. inserire una nuova pianta' + '\n' +
      '4. localizzare le piante di un tipo' + '\n' +
      '5. aggiornare il nome di una pianta' + '\n' +
      '6. eliminare una pianta' + '\n\n' + 
      'Scegli un opzione e premi ENTER: '
  );

  menuHandler = function(input){
    if(input !== null) {
      switch(input) {
        case '1': users(); break;
        case '2': openweather(); break;
        case '3': new_plant(); break;
        case '4': cerca_pianta(); break;
        case '5': update_pianta(); break;
        case '6': delete_pianta(); break;
        default: Menu();
      }
    }
  };
}

//LOGIN
function login(){
  var options = {
    host: HOST,
    path: '/users/login',
    port: PORT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  callback = function(response) {
    var str = '';
    cookie = response.headers['set-cookie'];
    response.on('data', function (chunk) {
      str += chunk;
    });
      
    response.on('end', function () {
      cookie=cookie+' ';
      var inizio = cookie.indexOf("=")+1;
      var fine = cookie.indexOf(";");
      my_cookie = cookie.substring(inizio, fine);
      cookies.set(my_cookie,{ mail: user});
    });
  }

  var req = http.request(options, callback);
  req.write('{"name":"'+user+'","password":"'+passw+'"}');
  req.end();
}

//USERS
function users(){
  console.log('\n'+'Users');

  var options = {
    host: HOST,
    path: '/users',
    port: PORT,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  };

  callback = function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      console.log(str);
    });
  }
      
  var req = http.request(options, callback);
  req.setHeader('Cookie',['auth='+my_cookie]);
  req.end();
}

//OPENWEATHER
function openweather(){
  console.log('\n'+'Openweather');
  var options = {
    'method': 'GET',
    'url': 'http://localhost:3000/weather',
    'headers': {
      'Content-Type': 'application/json',
      'Cookie': 'auth='+my_cookie
    },
    body: JSON.stringify({"city":"Lunano"})
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

//NEW_PLANT
function new_plant(){
  console.log('\n'+'Nuova Pianta');
  var options = {
    host: HOST,
    path: '/pianta',
    port: PORT,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection' : 'keep-alive'
      } 
    };

    callback = function(response) {
      
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      console.log('\n'+str);
    });
  }

  const id = 'CAC';
  const clima = '106';    
  const nome = 'Cactus';
  const latin = 'Cactacee';

  var req = http.request(options, callback);
  req.setHeader('Cookie',['auth='+my_cookie]);
  req.write('{"id":"'+id+'","clima":"'+clima+'", "name":"'+nome+'", "latin":"'+latin+'" }');
  req.end();
}

//CERCA_PIANTA
function cerca_pianta(){
  console.log('\n'+'Cerca Pianta');
  
  var options = {
    'method': 'GET',
    'url': 'http://localhost:3000/pianta',
    'headers': {
      'Content-Type': 'application/json',
      'Cookie': 'auth='+my_cookie
    },
    body: JSON.stringify({"name":"Olivo","password":"password"})
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}

//AGGIORNA PIANTA
function update_pianta(){
  console.log('\n'+'Update pianta');
  var options = {
  host: HOST,
  path: '/pianta/c_name',
  port: PORT,
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Connection' : 'keep-alive'
    } 
  };

  callback = function(response) {     
    var str = '';
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      console.log(str);
    });
  }

  var req = http.request(options, callback);
  req.setHeader('Cookie',['auth='+my_cookie]);
  req.write('{"name":"Olivo_nuovo", "newname":"Olivo"}');
  req.end();
}

//ELIMINA PIANTA
function delete_pianta(){
  console.log('\n'+'Elimina Pianta');
  
  var options = {
    'method': 'DELETE',
    'url': 'http://localhost:3000/pianta',
    'headers': {
      'Content-Type': 'application/json',
      'Cookie': 'auth='+my_cookie
    },
    body: JSON.stringify({"name":"Cactus"})
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
  });
}


Initialize();