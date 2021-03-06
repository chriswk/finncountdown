var Hapi = require('hapi');
var moment = require('moment');
var Vision = require('vision');
var inert = require('inert');
var server = new Hapi.Server();

module.exports = {
  createServer : function (port) {
    server.register(Vision, function (err) {
      if (err) {
        console.log("Failed to load vision");
      }

      server.views({
        engines: {
          html: require('handlebars')
        },
        relativeTo: global.appRoot,
        path: 'views'
      });
    })
    server.connection({ port: port});
    server.register(inert, function (err) {
      server.route({
        method: 'GET',
        path: '/components/{path*}', handler: { directory: { path: global.appRoot + '/bower_components'}}
      });
      server.route({
        method: 'GET',
        path: '/css/{path*}', handler: { directory: { path: global.appRoot + '/css'}}
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
      path: '/{date}/{hourmin?}',
      handler: function (request, reply) {
        var d, now = moment();
        if(request.params.hourmin) {
          var dString = request.params.date + "T" +request.params.hourmin;
          d = moment(dString);
        } else {
          var d = moment(request.params.date);
        }
        var title = request.query.title || d.format("dddd, MMMM Do YYYY, HH:mm:ss")
        reply.view('countdown', { countdown: d.valueOf(), title: title});
      }
    });

    server.start(function () {
      console.log('Server running at:', server.info.uri);
    });

  }
}
