import Exercise from 'App/Models/Exercise'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Exercise, ({ faker }) => {
    return {
        name: faker.lorem.words(2),
        description: faker.lorem.paragraph(2),
        image: faker.image.url(),
    }
}).build()
