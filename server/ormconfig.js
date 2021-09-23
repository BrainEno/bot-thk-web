const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
const rootDir = process.env.NODE_ENV === 'development' ? 'server' : 'dist'

module.exports = {
    type: 'mongodb',
    url: process.env.MONGDB_URI,
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    entities: [rootDir + '/entities/**/*{.ts,.js}'],
    cli: {
        entitiesDir: rootDir + '/entities',
    },
}
