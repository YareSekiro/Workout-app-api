import Training from '../../app/Models/Training'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Training, ({ faker }) => {
  return {
      name: faker.lorem.words(3)
  }
}).build()
