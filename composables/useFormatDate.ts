export const useFormatDate = (date: string) => {
  const dateTime = new Date(date);

  // Format date to "1 December 2024" style
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateTime);
};
