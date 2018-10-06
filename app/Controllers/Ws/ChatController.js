'use strict'
const Message = use('App/Models/Message')
class ChatController {
    constructor({
        socket,
        request
    }) {
        this.socket = socket
        this.request = request
    }
    onMessage(message) {
        this.socket.broadcastToAll('message', message)
        console.log(message)
        Message.create(message)
        var json = this.socket.channel;
        // console.log(JSON.stringify(json), 'aqui')
        /*
        const userData = {
            nome: "Leonel Rodrigo",
            email: "rodrigo@bredi.com.br"
        };
        const user2 = await User.create(userData)*/
    }
    onClose(m) {
        console.log(m.topic, 'close')
    };
}
module.exports = ChatController