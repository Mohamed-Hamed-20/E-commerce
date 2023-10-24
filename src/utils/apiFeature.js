import { pagenation } from "./pagination.js";

export class ApiFeature {
  constructor(MongoseQuery, QueryData) {
    this.MongoseQuery = MongoseQuery;
    this.QueryData = QueryData;
  }
  //pagination
  pagination() {
    const { page, size } = this.QueryData;

    console.log({ page, size });
    const { limit, skip } = pagenation({ size, page });
    this.MongoseQuery.limit(limit).skip(skip);
    return this;
  }
  //sort
  sort() {
    const { sort } = this.QueryData;
    this.MongoseQuery.sort(sort?.replaceAll(",", " "));
    return this;
  }
  //select
  select() {
    // const select = this.QueryData?.select;
    // this.MongoseQuery.select(select.replaceAll(",", " "));
    this.MongoseQuery.select(this.QueryData.select?.replaceAll(",", " "));
    return this;
    // return this;
  }
  //filter
  filter() {
    const queryInstance = { ...this.QueryData };
    const exclude = ["page", "size", "sort", "select", "search"];
    exclude.forEach((key) => {
      delete queryInstance[key];
    });
    console.log(queryInstance);
    const querystring = JSON.parse(
      JSON.stringify(queryInstance).replace(
        /gt|lt|gte|lte|regex|in|nin|neq|eq/g,
        (match) => {
          return `$${match}`;
        }
      )
    );
    this.MongoseQuery.find(querystring);
    return this;
  }
}
