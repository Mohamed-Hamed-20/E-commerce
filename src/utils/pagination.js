export const pagenation = ({ page = 1, size = 2 }) => {
  if (page < 1) page = 1;
  if (size < 1 || size > 10) size = 2;
  const limit = parseInt(size);
  const skip = parseInt((page - 1) * size);
  console.log(limit, skip);
  return { limit, skip };
};
