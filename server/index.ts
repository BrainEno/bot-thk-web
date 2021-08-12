import fastify, { FastifyInstance } from 'fastify'
import fastifyNext from 'fastify-nextjs'

const bootstrap = async () => {
    const port = parseInt(process.env.PORT!, 10) || 3000
    // const dev = process.env.NODE_ENV != 'production'

    const server: FastifyInstance = fastify({ logger: { level: 'debug' } })

    server.register(fastifyNext).after(() => {
        server.next('/')
    })

    try {
        await server.listen(port)
        console.log(`Server listening on http://localhost:${port}`)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}

bootstrap()
