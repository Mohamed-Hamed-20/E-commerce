import { connectionDB } from '../../DB/connection.js'
import { globalResponse } from './errorhandling.js'
import * as routers from '../modules/index.routes.js'

export const initiateApp = (app, express) => {
  const port = process.env.PORT

  app.use(express.json())
  connectionDB()

  app.use('/category', routers.categoryRouter)
  app.use('/subCategory', routers.subCategoryRouter)
  app.use('/brand', routers.brandRouter)
  app.use('/product', routers.productRouter)
  app.use('/coupon', routers.couponRouter)

  app.all('*', (req, res, next) =>
    res.status(404).json({ message: '404 Not Found URL' }),
  )

  app.use(globalResponse)

  app.get('/', (req, res) => res.send('Hello World!'))
  app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
