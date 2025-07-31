let user = 'wrham';
let url = 'https://lastfm-last-played.biancarosa.com.br/' + user + '/latest-song';
let song = document.querySelector('#song');
fetch(url)
  .then(function (response) {
      return response.json()
  }).then(function (json) {
      song.innerHTML = '🎧 playing ' + json['track']['name'] + ' by ' + json['track']['artist']['#text'];
  });
