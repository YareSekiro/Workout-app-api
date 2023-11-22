import Factory from '@ioc:Adonis/Lucid/Factory'
import User from '../../app/Models/User'

export default Factory.define(User, ({ faker }) => {
  return {
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: "secret1234",
    //
  }
}).build()
