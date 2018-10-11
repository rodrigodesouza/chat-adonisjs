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
    async onMessage(message) {
        // console.log(message, this.socket.topic)
        if (this.socket.topic == 'chat:verificaSala') {
            const Sala = use('App/Models/Sala')
            let verificaSala = await Sala.query().whereRaw("(user2_id =" + message.to + " and user1_id = " + message.from + ") or user2_id = " + message.from + " and user1_id = " + message.to).first();
            //.where('user2_id', message.to).where('user1_id', message.from)
            let sala = Math.random(55555 * 55555);
            // console.log(sala)
            var criaSala;
            if (!verificaSala) {
                criaSala = await Sala.create({
                    user2_id: message.to,
                    user1_id: message.from,
                    nome: sala,
                    token_sala: sala
                })
                message.novaSala = criaSala;
                this.socket.broadcastToAll('message', message)
            } else {
                verificaSala = verificaSala.toJSON();
                message.novaSala = verificaSala;
                console.log(message, '   verificaSala')
                this.socket.broadcastToAll('message', message)
            }
        } else {
            this.socket.broadcastToAll('message', message)
        }
        console.log(this.socket.topic, ' topic')
        // this.socket.broadcastToAll('verificaSala', message)
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