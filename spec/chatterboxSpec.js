describe('chatterbox', function() {
  it('should parse correctly and have an object named `app`', function(){
    expect(app).to.be.an('object');
  });

  describe('init', function() {
    it('should have a method called init', function(){
      expect(app.init).to.be.ok;
    });

  });

  describe('app behavior', function() {
    var ajaxSpy;

    before(function() {
      ajaxSpy = sinon.stub($, 'ajax');
      app.init();
    });

    beforeEach(function() {
      ajaxSpy.reset();
    });

    describe('sending', function() {
      it('should have a send method', function(){
        expect(app.send).to.be.ok;
      });

      it('should submit a POST request via $.ajax', function(done){
        app.send([]);
        expect($.ajax.calledOnce).to.be.true;
        // sinon.spy method `args` comes in the form [function calls][arguments from that call]
        ajaxOptions = typeof $.ajax.args[0][0] === 'object' ? $.ajax.args[0][0] : $.ajax.args[0][1];
        expect(ajaxOptions.type).to.equal('POST');
        done();
      });

      it('should send the correct message along with the request', function(done){
        var message = {
          username: 'Mel Brooks',
          text: 'It\'s good to be the king',
          roomname: 'lobby'
        };

        app.send(message);
        ajaxOptions = typeof $.ajax.args[0][0] === 'object' ? $.ajax.args[0][0] : $.ajax.args[0][1];
        var result = JSON.parse(ajaxOptions.data);
        expect(result).to.deep.equal(message);
        done();
      });

    });

    describe('fetching', function() {
      it('should have a fetch method', function(){
        expect(app.fetch).to.be.ok;
      });

      it('should submit a GET request via $.ajax', function(done){
        app.fetch();
        expect($.ajax.calledOnce).to.be.true;
        ajaxUrl = typeof $.ajax.args[0][0] === 'string' ? $.ajax.args[0][0] : $.ajax.args[0][0].url;
        expect(ajaxUrl).to.equal(app.server);
        done();
      });

    });

    describe('chatroom behavior', function() {
      it('should be able to clear messages from the DOM', function(){
        var orig = $('#chats').html('<blink>OMG IT\'s 1998!</blink>');
        app.clearMessages();
        expect($('#chats').children().length).to.equal(0);
      });

      it('should be able to add messages to the DOM', function(){
        var message = {
          username: 'Mel Brooks',
          text: 'Never underestimate the power of the Schwartz!',
          roomname: 'lobby'
        };

        app.addMessage(message);

        expect($('#chats').children().length).to.equal(1);
      });

      it('should be able to add rooms to the DOM', function(){
        app.addRoom('superLobby');

        expect($('#roomSelect').children().length).to.equal(1);
      });

    });

    describe('events', function() {
      it('should add a friend upon clicking their username', function(){
        sinon.spy(app, 'addFriend');

        app.addMessage({
          username: 'Mel Brooks',
          text: 'I didn\'t get a harumph outa that guy.!',
          roomname: 'lobby'
        });

        app.init();

        $('#main').find('.username').trigger('click');
        expect(app.addFriend.called).to.be.true;

        app.addFriend.restore();
      });

      it('should try to send a message upon clicking submit', function(){
        sinon.spy(app, 'handleSubmit');

        $('#message').val('Why so many Mel Brooks quotes?');

        app.init();

        $('#send .submit').trigger('submit');
        expect(app.handleSubmit.calledOnce).to.be.true;

        app.handleSubmit.restore();
      });
    });
  });
});
