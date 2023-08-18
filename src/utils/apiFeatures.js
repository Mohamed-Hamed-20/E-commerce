import { paginationFuction } from './pagination.js'

export class ApiFeatures {
  constructor(mongooseQuery, queryData) {
    this.mongooseQuery = mongooseQuery
    this.queryData = queryData
  }

  // pagination
  pagination() {
    const { page, size } = this.queryData
    const { limit, skip } = paginationFuction({ page, size })
    this.mongooseQuery.limit(limit).skip(skip)
    return this
  }

  // sort

  sort() {
    this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',', ' '))
    return this
  }
  // select

  select() {
    this.mongooseQuery.select(this.queryData.select?.replaceAll(',', ' '))
    return this
  }
  //filters
  filters() {
    const queryInstance = { ...this.queryData }
    const execuldeKeysArr = ['page', 'size', 'sort', 'select', 'search']
    execuldeKeysArr.forEach((key) => delete queryInstance[key])
    const queryString = JSON.parse(
      JSON.stringify(queryInstance).replace(
        /gt|gte|lt|lte|in|nin|eq|neq|regex/g,
        (match) => `$${match}`,
      ),
    )
    this.mongooseQuery.find(queryString)
    return this
  }
}


//========= break 9:35 