Francesco Ottaviani								matricola 293503

Nome progetto: Vivaio

Note:
Il server è attivo all'indirizzo: https://morning-temple-86022.herokuapp.com
Il client è disponibile nella repository github: https://github.com/ottaviani2/client_esame.git
Il server funzionante su heroku è disponibile nella repository github: https://github.com/ottaviani2/server_esame_heroku.git



Il presente progetto è realizzato in node js, sia il server che il client. 

Si tratta di un interfaccia per un database che contiene informazioni su piante che è utilizzato da un altro programma come gestionale per aziende florovivaistiche. 

Tramite la richiesta -> SAPERE DOVE SONO LE PIANTE DI UN TIPO permette di conoscere le aziende che possiedono il tipo di pianta desiderato.

Il progetto utilizza il servizio esterno openweather che permette di conoscere le condizioni ambientali di una località scelta.

Per le richieste http di LOGIN, LISTA UTENTI, INSERIRE UNA NUOVA PIANTA e AGGIORNARE IL NOME DI UNA PIANTA si è scelto di utilizzare la libreria "http", formato http.request(options, callback).

Per le richieste http di RICHIESTA A SERVIZIO ESTERNO OPENWEATHERMAP, SAPERE DOVE SONO LE PIANTE DI UN TIPO e ELIMINARE UNA PIANTA si è scelto di utilizzare la libreria "request", formato request(options, function (error, response) {...}.

Tutti i parametri sono trasmessi in JSON nel body della richiesta.

Gli headers delle richieste http sono impostati con Content_Type : 'application/json'.

Le risposte del server per le richieste LISTA UTENTI, RICHIESTA A SERVIZIO ESTERNO OPENWEATHERMAP e SAPERE DOVE SONO LE PIANTE DI UN TIPO sono in JSON. 

Per le altre richieste il server risponde con status: 200.

Prima si effettua il login, viene settato il cookie per la sessione e in seguito si possono eseguire le varie richieste al server.


POSSIBILI RICHIESTE

-> LOGIN
Effettua il login e setta il cookie per le future richieste.

method : 'POST'
path: '/users/login'

body:
{
  'name' : 'name',
  'password' : 'password'
}

Il server restituisce la frase "You are logged in", status: 200.


-> LISTA UTENTI
Restituisce la lista degli utenti registrati

method : 'GET'
path: '/users'

Il server restituisce la lista degli utenti registrati in formato json.


-> RICHIESTA A SERVIZIO ESTERNO OPENWEATHERMAP
Restituisce i parametri climatici come umidità, pressione, temperatura, durata della giornata di una città.
Funziona solo per città italiane.

method : 'GET'
path: '/weather'

body:
{
'city' : 'città'
}

Il server restituisce una lista di parametri riguardanti la città scelta.

OPERAZIONI CRUD

-> INSERIRE UNA NUOVA PIANTA
Inserisce una nuova pianta nel database.

method : 'POST'
path: '/pianta'

body:
{
  'id' : 'id', (*)	
  'name' : 'nome comune',
  'latin' : 'nome latino',
  'clima' : 'tipo di fascia climatica' (**)
}

(*)  l'id è un codice alfanuerico scelto dall'utente.
(**) il tipo di fascia climatica è un id collegato ad un 
     altra tabella quindi va inserito un id esistente.

Il server restituisce status: 200.
-> SAPERE DOVE SONO LE PIANTE DI UN TIPO
Permette di conoscere le posizioni di una pianta all'interno del db.

method : 'GET'
path: '/pianta'

body:
{
  'name' : 'nome pianta'
}

Il server restituisce una lista dei posti dove si puo trovare questa pianta, 
"Empty" se non si trova in nessun luogo all'interno del db.


-> AGGIORNARE IL NOME DI UNA PIANTA
Aggiorna solo il nome comune

method : 'PUT'
path: '/pianta/c_name'

body:
{
  'name' : 'nome da aggiornare',
  'newname' : 'nuovo nome'
}

Il server restituisce status: 200.


-> ELIMINARE UNA PIANTA
Permette di eliminare una pianta dal database, passando come parametro il nome comune o il nome latino della pianta.

method : 'DELETE'
path: '/pianta'

body:
{
  'name' : 'nome pianta'
}

Il server restituisce status: 200.
