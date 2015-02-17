$(document).on('ready', function () {
  var friends = {};
  var update = function (response) {
    console.log(response);
    var div = $('<div></div>');
    for(var i = 0, count = response.results.length; i < count; i++){

      var content = $('<p></p>');
      if (friends[response.results[i].username] === undefined){
        content.append('Username: ' + '<div class="clickMe">' + response.results[i].username + '</div>' + '<br>');
      }
      else{
        content.append('Username: ' + '<strong>' + response.results[i].username + '</strong>' + '<br>');
      }
      content.append('Text: ' + response.results[i].text + '<br>');
      content.append('Create At: ' + response.results[i].createdAt+ '<br>');
      content.append('Room Name: ' + response.results[i].roomname + '<br>');
      div.append(content);
    }
    $('.content').html(div);
  };

  $('body').on('click', '.clickMe', function(event){
    event.preventDefault();
    friends[$(this).text()] = $(this).text()
  });

  $('body').on('submit', '.name', function (event) {
    event.preventDefault();
    $('.currentUserName').text($('#username').val());
  });

  $('body').on('submit', '.room', function (event) {
    event.preventDefault();
    $('.currentRoom').text($('#roomname').val());
  });

  $('body').on('click', 'button', function () {

    var roomName = $('.currentRoom').text();
    $.ajax('https://api.parse.com/1/classes/chatterbox', {
      type: 'GET',
      data: 'where={"roomname":'+ '"' + roomName +'"' +'}',
      data: 'order=-createdAt',
      success: function (response) {
        update(response);
      },
      contentType: 'application/json',
      error: function (errorMessage, errorType, error) {
      }
    });
  })

  $('body').on('submit', '.message', function (event){
    event.preventDefault();
    var obj = {
      "username": $('#username').val(),
      "text": $('#text').val(),
      "roomname": $('#roomname').val()
    };

    var JSONobj = JSON.stringify(obj);

    $.ajax('https://api.parse.com/1/classes/chatterbox', {
      type: 'POST',
      data: JSONobj,
      dataType: 'json',
      contentType: 'application/json',
      success: function (response) {
        console.log(response);
        $.ajax('https://api.parse.com/1/classes/chatterbox', {
          success: function (response) {
            update(response);
          },
          contentType: 'application/json',
          error: function (errorMessage, errorType, error) {
          }
        });
      },
      error: function () {
        console.log('data was not submitted');
      }
    })

  })

  /// END OF DOCUMENT REA
});




































