var client = new WebTorrent()

if (window.location.hash) {
  $('#content-goes-here').html('Downloading page from seeds...');
  $('#new-page').show()
  client.add('magnet:?xt=urn:btih:' + document.URL.substr(document.URL.indexOf('#') + 1), function (torrent) {
    swarm = torrent.swarm

    $('#seeds-count').html(swarm.wires.length + 1)

    swarm.on('wire', function(wire) {
      $('#seeds-count').html(swarm.wires.length + 1)
    });

    var file = torrent.files[0]

    file.getBuffer(function (err, buffer) {
      if (err) throw err
        $('#content-goes-here').html(buffer.toString('utf8'))
    })
  });
}
else
{
  $('#new-page').show()

  $("form").submit(function(e) {
    e.preventDefault();

    var f = new File([$('#new-page-content').val()], "html");

    $('#content-goes-here').html($('#new-page-content').val())

    client.seed(f, function onseed (torrent) {
      magnetURI = torrent.magnetURI.split(':')[3].split('&')[0]
      document.location.hash = magnetURI;

      swarm = torrent.swarm

      swarm.on('wire', function(wire) {
        $('#seeds-count').html(swarm.wires.length + 1)
      });
    });
    return false;
  });
}
