let ws = null
$(function() {
    // if (window.username) {
    //     console.log('aioi', window.username)
    // }
    startChat()
})

function startChat() {
    ws = adonis.Ws().connect()
    ws.on('open', () => {
        $('#status').addClass('badge-green')
        subscribeToChannel()
        console.log('conectado')
    })
    ws.on('error', () => {
        $('#status').removeClass('badge-green')
    })
}

function subscribeToChannel() {
    const chat = ws.subscribe('chat:public')
    const verificaSala = ws.subscribe('chat:verificaSala')
    chat.on('error', () => {
        $('#status').removeClass('badge-green')
        console.log(error)
    })
    chat.on('message', (message) => {
        console.log(message, 'recebendo mensagem');
        $("#public-chat").append('<li>' + message + '</li>');
        /*$('.messages').append(`
      <div class="message"><h3> ${message.username} </h3> <p> ${message.body} </p> </div>
    `)*/
    })
    chat.on('new:user', () => {
        $('.messages').append(`
      <div class="message"><p>Novo usuário entrou no chat </p> </div>
    `)
    })
}
$("#enviaTodos").click(function() {
    let msgTodos = $("#msgTodos").val();
    if (msgTodos) {
        $("#msgTodos").val('')
        ws.getSubscription('chat:public').emit('message', msgTodos);
    }
});
$('#message').keyup(function(e) {
    if (e.which === 13) {
        e.preventDefault()
        const message = $(this).val()
        $(this).val('')
        ws.getSubscription('chat:public').emit('message', {
            username: window.username,
            body: message
        })
        return
    }
})
$(document).ready(function() {
    $(".ativaJanela").click(function() {
        verificaJanela($(this));
    });
});

function verificaJanela(user) {
    let id = user.data('user-id');
    if ($("#window-" + id).length == 0) {
        criaJanela(user);
    }
}

function criaJanela(user) {
    var id = user.data('user-id');
    var janela = '\
  <div class="bodyChat" id="window-' + id + '">\
    <div class="head">\
        <span id="h-name-' + id + '">\
        <strong>' + user.text() + '</strong>\
          <div class="btn-group pull-right">\
            <button class="btn btn-default btn-xs minimize">\
              <span class="glyphicon glyphicon-minus"></span>\
            </button>\
            <button class="btn btn-danger btn-xs closeWindow" data-id="' + id + '">\
              <span class="glyphicon glyphicon-remove"></span>\
            </button>\
          </div>\
        </span>\
      </div>\
    <div class="main">\
    <div class="body">\
      <div id="div-msg-' + id + '"></div>\
    </div>\
    <footer>\
      <form action="#" method="post">\
            <div class="input-group">\
              <input type="text" name="message" placeholder="Type Message ..." class="form-control" id="input-send-' + id + '" data-id="' + id + '">\
                  <span class="input-group-btn">\
                    <button type="button" class="btn btn-primary sendMessage" id="btn-send-' + id + '" data-id="' + id + '">Send</button>\
                  </span>\
            </div>\
        </form>\
    </footer>\
    </div>\
 </div>';
    $('.bodyWindows').prepend(janela)
}
$('.bodyWindows').delegate('.closeWindow', 'click', function() {
    closeWindow($(this));
});
$('.bodyWindows').delegate('.minimize', 'click', function() {
    $(this).parents('.bodyChat').find('.main').toggle();
});

function closeWindow(user) {
    $('#window-' + user.data('id')).remove();
}
$('.bodyWindows').delegate('.sendMessage', 'click', function() {
    let id = $(this).data('id');
    msg = $("#input-send-" + id).val();
    if (msg) {
        sendMessage(msg, id);
    }
});

function sendMessage(msg, id) {
    verificaSala(id);
    // alert(msg)
}

function verificaSala(id) {
    ws.getSubscription('chat:verificaSala').emit('message', {
        from: $("#loginUsuario").val(),
        to: id
    })
}