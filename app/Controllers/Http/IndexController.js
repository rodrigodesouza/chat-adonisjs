'use strict'
// const User = use('App/Models/User');
const User = use('App/Models/User');
class IndexController {
    async insere() {
        const userData = {
            nome: "Leonel Rodrigo",
            email: "rodrigo@bredi.com.br"
        };
        const user2 = await User.create(userData)
        return user2
    }
    async index() {
        // const User = use('App/Models/User')
        // const users = await User.all()
        /*
        const user = new User()
        user.username = 'virk'
        user.age = 22
        user.fill({
            age: 23
        }) // remove existing values, only set age.
        // await user.save();
        console.log(user)
        */
        var dado = await User.all();
        return dado;
        // return 'aqui'
    }
}
module.exports = IndexController