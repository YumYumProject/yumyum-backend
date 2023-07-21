import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'
import { newHandlerContent } from './handlers/content'
import { newRepositoryContent } from './repositories/content'

async function main() {
  const db = await mongoose.connect(process.env.DATABASE_URL!)

  const repoContent = newRepositoryContent(db)
  const handlerContent = newHandlerContent(repoContent)
  const port = process.env.PORT || 8000
  const server = express()

  server.use(express.json())
  server.use(cors())

  const menuRouter = express.Router()
  server.use('/menu', menuRouter)

  menuRouter.get('/', handlerContent.getRecipesByFilter.bind(handlerContent))
  server.get('/menus', handlerContent.getAllRecipes.bind(handlerContent))

  menuRouter.get('/:id', handlerContent.getRecipeById.bind(handlerContent))

  server.get('/', (req, res) => {
    res.send('Hello, world!')
  })

  server.listen(port, () => console.log(`server listening on ${port}`))
}

main()
