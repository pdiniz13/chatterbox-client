$(document).on('ready', function () {
  var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

  var tagOrComment = new RegExp(
    '<(?:'
      // Comment body.
    + '!--(?:(?:-*[^->])*--+|-?)'
      // Special "raw text" elements whose content should be elided.
    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
      // Regular name
    + '|/?[a-z]'
    + tagBody
    + ')>',
    'gi');
  function removeTags(html) {
    var oldHtml;
    do {
      oldHtml = html;
      html = html.replace(tagOrComment, '');
    } while (html !== oldHtml);
    return html.replace(/</g, '&lt;');
  }


  var friends = {};

  var newUpdate = function () {
    var currentRoom = $('#currentRoom').text();
    var where = '{"roomname":' + '"' + currentRoom + '"' + '}';
    var roomName = $('#currentRoom').text();
    $.ajax('https://api.parse.com/1/classes/chatterbox', {
      type: 'GET',
      data: {where: where, order: '-createdAt', limit: "10"},
      success: function (response) {
        var div = $('<div></div>');
        for(var i = 0, count = response.results.length; i < count; i++){
          var text;
          if (response.results[i].text !== undefined && response.results[i].text !== null) {
            text = removeTags(response.results[i].text);
          }
          else{
            text = ""
          }
          var createdAt = removeTags(response.results[i].createdAt);
          var roomName;
          if (response.results[i].roomname !== undefined && response.results[i].roomname !== null){
            roomName = removeTags(response.results[i].roomname);
          }
          else{
            roomName = "unknown";
          }
          var userName;
          if (response.results[i].username !== undefined && response.results[i].username !== null){
            userName = removeTags(response.results[i].username);
          }
          else{
            userName = undefined;
          }

          var content = $('<p></p>');
          if (friends[userName] === undefined){
            content.append('Username: ' + '<div class="clickMe">' + response.results[i].username + '</div>' + '<br>');
          }
          else{
            content.append('Username: ' + '<strong>' + response.results[i].username + '</strong>' + '<br>');
          }
          content.append('Text: ' + text + '<br>');
          content.append('Create At: ' + createdAt+ '<br>');
          content.append('Room Name: ' + roomName + '<br>');
          div.append(content);
        }
        $('.content').html(div);
      },
      contentType: 'application/json',
      error: function (errorMessage, errorType, error) {
      }
    });
  };

  $('body').on('click', '.clickMe', function(event){
    event.preventDefault();
    if (friends[$(this).text()] === undefined){
      console.log($(this).text());
      friends[$(this).text()] = $(this).text();
      $('#friends').append("<li>" + $(this).text() + "</li>");
      newUpdate();
    }

  });

  $('body').on('submit', '.name', function (event) {
    event.preventDefault();
    $('#currentUserName').text($('#username').val());
  });

  $('body').on('submit', '.room', function (event) {
    event.preventDefault();
    $('#currentRoom').text($('#roomname').val());
    newUpdate();
  });

  $('body').on('click', '.refresh', function () {
    newUpdate();
  });

  $('body').on('submit', '.message', function (event){
    event.preventDefault();
    var obj = {
      "username": $('#currentUserName').text(),
      "text": $('#text').val(),
      "roomname": $('#currentRoom').text()
    };

    var JSONobj = JSON.stringify(obj);

    $.ajax('https://api.parse.com/1/classes/chatterbox', {
      type: 'POST',
      data: JSONobj,
      dataType: 'json',
      contentType: 'application/json',
      success: function () {
        newUpdate();
      },
      error: function () {
        console.log('data was not submitted');
      }
    })

  })

  newUpdate();
  setInterval(newUpdate, 1000);
  /// END OF DOCUMENT REA
});
































