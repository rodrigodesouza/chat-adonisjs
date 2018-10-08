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
    // this.socket.on('verificaSala', () => {})
    onMessage(message) {
        console.log(message, this.socket.topic)
        if (this.socket.topic == 'chat:verificaSala') {}
        // this.socket.broadcastToAll('verificaSala', message)
        this.socket.broadcastToAll('message', message)
        // Message.create(message)
        // var json = this.socket.channel;
        // console.log(JSON.stringify(json), 'aqui')
        /*
        const userData = {
            nome: "Leonel Rodrigo",
            email: "rodrigo@bredi.com.br"
        };
        const user2 = await User.create(userData)*/
    }
    onOpen(room) {
        // const user = this.socket.currentUser
        console.log(room)
        // throw error to deny a socket from joining room
    }
    onClose(m) {
        console.log(JSON.stringify(this.socket.topic), 'close')
    };
}
module.exports = ChatController