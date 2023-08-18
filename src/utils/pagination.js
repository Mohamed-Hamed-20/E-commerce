export const paginationFuction = ({ page = 1, size = 2 }) => {
  if (page < 1) page = 1
  if (size < 1) size = 2

  const limit = parseInt(size)
  const skip = (parseInt(page) - 1) * parseInt(size)

  return {
    limit,
    skip,
  }
}
