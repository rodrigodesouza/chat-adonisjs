'use strict'
const Schema = use('Schema')
class SalasSchema extends Schema {
    up() {
        this.create('salas', (table) => {
            table.increments()
            table.integer('user_id').unsigned().references('id').inTable('users')
            table.string('nome', 255).notNullable()
            table.boolean('is_multiple').defaultTo(false)
            table.timestamps()
        })
    }
    down() {
        this.drop('salas')
    }
}
module.exports = SalasSchema