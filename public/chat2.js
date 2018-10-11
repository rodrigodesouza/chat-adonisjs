let ws = null
console.log(minhasSalas, '   minhasSalas')
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
    chat.on('error', (error) => {
        $('#status').removeClass('badge-green')
        console.log(error)
    })
    chat.on('message', (message) => {
        console.log(message, 'recebendo mensagem');
        $("#public-chat").append('<li>' + message + '</li>');
    })
    verificaSala.on('message', async (message) => {
        $("#window-" + message.to).attr('data-sala', message.novaSala.token_sala);
        let Salaum = new Array;
        if (ws.getSubscription('chat:' + message.novaSala.token_sala)) {
            Salaum[message.novaSala.token_sala] = await ws.getSubscription('chat:' + message.novaSala.token_sala);
        } else {
            Salaum[message.novaSala.token_sala] = await ws.subscribe('chat:' + message.novaSala.token_sala);
        }
        console.log(message, ' verificaSala');
        Salaum[message.novaSala.token_sala].on('message', (msg) => {
            console.log(msg, '   msg')
            $('div[data-sala="' + msg.sala + '"]').find('.div-msg').append('<li>' + msg.msg + '</li>')
        })
    });
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
    var sala = user.data('sala');
    var janela = '\
  <div class="bodyChat" id="window-' + id + '" data-sala="' + sala + '">\
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
      <div class="div-msg" id="div-msg-' + id + '"></div>\
    </div>\
    <footer>\
      <form action="javascript:void(0)" method="post">\
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
    if ($("#window-" + id).data('sala') != undefined && $("#window-" + id).data('sala') != 'undefined') {
        let sala = $("#window-" + id).data('sala'); //.replace('"', '');
        sendMessage(id, msg, sala);
    } else {
        verificaSala(id);
    }
});
async function sendMessage(id, msg, sala) {
    let msgem;
    if (ws.getSubscription('chat:' + sala)) {
        msgem = ws.getSubscription('chat:' + sala);
    } else {
        msgem = ws.subscribe('chat:' + sala);
    }
    console.log('enviando...')
    msgem.emit('message', {
        msg: msg,
        id: id,
        sala: sala
    });
    msgem.on('message', (msg) => {
        $('div[data-sala="' + msg.sala + '"]').find('.div-msg').append('<li>' + msg.msg + '</li>')
    })
    msgem.on('error', (m) => {
        console.log(m, '  error xxx')
    })
    $("#input-send-" + id).val('');
    // console.log(msgem, ' msgem', 'chat:' + sala);
}

function verificaSala(id) {
    ws.getSubscription('chat:verificaSala').emit('message', {
        from: $("#loginUsuario").val(),
        to: id
    })
}