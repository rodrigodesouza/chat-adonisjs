'use strict'
class ChatController {
    async index({
        view,
        request
    }) {
        const User = use('App/Models/User');
        const query = request.get()
        let usuario = await User.query().where('username', query.username).first();
        usuario = usuario.toJSON();
        var dados = await User.all();
        return view.render('chat', {
            users: dados.rows,
            usuario: usuario
        });
        // return 'aqui'
    }
}
module.exports = ChatController