export const useFormatTime = (date: string) => {
  const dateTime = new Date(date);

  // Format date to "1 December 2024, 16:00" style in Thailand timezone (UTC+7)
  return new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false, // Use 24-hour format
    timeZone: 'Asia/Bangkok', // Thailand timezone (UTC+7)
  }).format(dateTime);
};
