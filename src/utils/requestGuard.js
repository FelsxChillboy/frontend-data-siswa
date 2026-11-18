export const createRequestGuard = () => {
  let latest = 0;

  return {
    next: () => ++latest,
    isCurrent: (token) => token === latest,
    invalidate: () => {
      latest += 1;
    },
  };
};
