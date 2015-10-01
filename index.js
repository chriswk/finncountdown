var Hapi = require('hapi');
var moment = require('moment');
var Vision = require('vision');
var inert = require('inert');
var HapiReactViews = require('hapi-react-views');
var server = new Hapi.Server();

server.register(Vision, function (err) {
  if (err) {
    console.log("Failed to load vision");
  }

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'views'
  });
})
var port = process.env.PORT || 3000;
server.connection({ port: port});
server.register(inert, function (err) {
  server.route({
    method: 'GET',
    path: '/components/{path*}', handler: { directory: { path: './bower_components'}}
  });
});

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply("Hello world");
  }
});

server.route({
  method: 'GET',
  path: '/{date}/{hourmin}/{title}',
  handler: function (request, reply) {
    var d, now = moment();
    if(request.params.hourmin) {
      var dString = request.params.date + "T" +request.params.hourmin;
      d = moment(dString);
    } else {
      var d = moment(request.params.date);
    }
    var title = request.params.title || d.format("dddd, MMMM Do YYYY, h:mm:ss a")
    reply.view('countdown', { countdown: d.valueOf(), title: title});
  }
})
server.start(function () {
  console.log('Server running at:', server.info.uri);
});
