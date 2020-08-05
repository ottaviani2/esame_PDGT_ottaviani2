const http = require('http');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var menuHandler;

const user = "fra.otto@hotmail.com";
const passw = "password"
const cookies = new Map();

var cookie = '';
var mail = '';
var pswd = '';
var input = '';

// Main
function Initialize() {
    rl.question('Benvenuto!\n Inserire mail: ', (answer) => {
        mail = answer;
        rl.question('Inserire password: ', (answer) => {
        pswd = answer;
        Menu();
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', checkMenu);

        function checkMenu() {
            var input = process.stdin.read();
            if(input !== null) {
                menuHandler(input.trim());
            }
        }
        });
    });
}


function Menu(){
    console.log(
        '1. lista utenti' + '\n' +
        '2. richiesta parametri ambientali a servizio esterno' + '\n' +
        '3. inserire nuovo utente' + '\n' +
        '4. login' + '\n' +
        '5. inserire una nuova pianta' + '\n' +
        '6. localizzare le piante di un tipo' + '\n' +
        '7. aggiornare il nome di una pianta' + '\n' +
        '8. eliminare una pianta' + '\n\n' + 
        'Scegli un opzione e premi ENTER: '
    );

    menuHandler = function(input){
        if(input !== null) {
        switch(input) {
            case '1': users(); break;
            case '2': openweather(); break;
            case '3': new_user(); break;
            case '4': login(); break;
            case '5': new_plant(); break;
            case '6': cerca_pianta(); break;
            case '7': update_pianta(); break;
            case '8': delete_pianta(); break;
            default: Menu();
        }
        }
    };
}

function users(){
    console.log('\n'+'Users');
    login();
    /*var options = {
        host: 'localhost',
        path: '/users',
        port: '3000',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
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
      //This is the data we are posting, it needs to be a string or a buffer
      //req.write("hello world!");
      req.end();
      */
      
}

function login(){
    var options = {
        host: 'localhost',
        path: '/users/login',
        port: '3000',
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
          var my_cookie = cookie.substring(inizio, fine);
          cookies.set(mycookie,{ mail: user}); // user no l'account admin, mail con account inserito da utente
          console.log(my_cookie);
        });
    }

    var req = http.request(options, callback);
    req.write('{"name":"'+user+'","password":"'+passw+'"}');
    req.end();
}

Initialize();

/*
var get = {
    host: 'localhost',
    path: '/',
    port: '3000',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
  };

var post = {
  host: 'localhost',
  path: '/',
  port: '3000',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
}
};

var put = {
    host: 'localhost',
    path: '/',
    port: '3000',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
  };

var del = {
    host: 'localhost',
    path: '/',
    port: '3000',
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json'
    }
  };

callback = function(response) {
  var str = ''
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    console.log(str);
  });
}

//var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
//req.write("hello world!");
//req.end();


var str_get = "{'city' : '"+city+"'}";

var str_post_user = "{'name' : '"+name+"','password' : '"+password+"'}";

var str_post_login = "{'name' : '"+name+"','password' : '"+password+"'}";

var post_nuova_pianta = "{'name' : 'nome comune','latin' : 'nome latino','clima' : 'tipo di fascia climatica'}";

var get_pianta = "{'name' : 'nome pianta'}";

var put_pianta = "{'name' : 'nome da aggiornare','newname' : 'nuovo nome'}";

var del_pianta = "{'name' : 'nome pianta'}";
  
  */



