const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
​
app.use(express.static(__dirname + '/public'));
io.on('connection', onConnection);
http.listen(port, () => console.log('listening on port ' + port));

const numRooms = 5;
const maxPeople = 4;
let deck = Array.apply(null, Array(108)).map(function (_, i) {return i;});
function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
  }
  let data = [];
for (let i = 1; i <= numRooms; i++) {
  let room = [];
  room['timeout'] = [];
  room['timeout']['id'] = 0;
  room['timeout']['s'] = 10;
  room['deck'] = [];
  room['reverse'] = 0;
  room['turn'] = 0;
  room['cardOnBoard'] = 0;
  room['people'] = 0;
  let players = [];
  for (let j = 0; j < maxPeople; j++) {
    let p = [];
    p['id'] = 0;
    p['name'] = "";
    p['hand'] = [];
    players[j] = p;
  }
  room['players'] = players;
  data['Room_'+i] = room;
}
