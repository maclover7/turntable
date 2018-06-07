var app = app || {};

app.providers = {};

function SoundCloud() {
  this.widget = null;
  this.widgetBaseUrl = 'https://api.soundcloud.com/tracks/';
  this.frameBaseUrl = 'https://w.soundcloud.com/player?url=' + this.widgetBaseUrl;

  this.mount = function(songID) {
    this._createElement(songID);
    this.widget = app.player = SC.Widget('player');

    that = this;
    this.widget.load(this.widgetBaseUrl + songID, {
      callback: function(e) {
        that.widget.play();
      }
    });
  };

  this._createElement = function(songID) {
    iframe = document.createElement('iframe');
    iframe.id = 'player';
    iframe.src = this.frameBaseUrl + songID;
    app.widgetContainer[0].appendChild(iframe);
  };
};

function YouTube() {
  this.mount = function(songID) {
    this._createElement();

    this.widget = app.player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: 'M7lc1UVf-VE',
      events: {
        'onReady': this._onPlayerReady,
        'onStateChange': this._onPlayerStateChange
      }
    });
  };

  this._createElement = function() {
    div = document.createElement('div');
    div.id = 'player';
    app.widgetContainer[0].appendChild(div);
  };

  this._onPlayerReady = function(event) {
    event.target.playVideo();
  };

  this._onPlayerStateChange = function() {
  };
};

$(document).ready(function() {
  app.player = null;

  app.providers['soundcloud'] = new SoundCloud();
  app.providers['youtube'] = new YouTube();

  app.widgetContainer = $('#player-wrapper');

  app.play = function(data) {
    app.widgetContainer.empty();
    app.providers[data.provider].mount(data.providerUid);
  };

  buttons = [
    $('#soundcloudButton'),
    $('#youtubeButton')
  ];

  buttons.forEach(function(el) {
    el.click(function(event) {
      data = $(event.target).data();
      app.play(data);
    });
  });
});
