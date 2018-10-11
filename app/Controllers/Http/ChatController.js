'use strict'
class ChatController {
    async index({
        view,
        request
    }) {
        const Database = use('Database')
        const User = use('App/Models/User');
        const Sala = use('App/Models/Sala');
        const query = request.get()
        let usuario = await User.query().where('username', query.username).first();
        usuario = usuario.toJSON();
        let sqlRaw = '(select token_sala from salas where salas.user1_id = users.id and salas.user2_id = ' + usuario.id + ' or salas.user1_id = ' + usuario.id + ' and salas.user2_id = users.id) as token_sala';
        var dados = await User.query().select('users.*', Database.raw(sqlRaw)).where('users.username', '!=', usuario.username).get();
        var minhasSalas = await Sala.query().where('user1_id', usuario.id).get();
        // minhasSalas = minhasSalas.toJSON();
        // console.log(minhasSalas);
        // console.log('aaa ', dados)
        return view.render('chat', {
            users: dados,
            usuario: usuario,
            minhasSalas: minhasSalas
        });
        // return 'aqui'
    }
}
module.exports = ChatController