export const useFormatDateTime = (
  date: Date,
  format: 'date' | 'ISOdate' | 'time' | 'fullDate'
) => {
  const dateTime = new Date(date);

  const formatFullDate = (date: Date): string => {
    const dayOfWeek = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
    }).format(date);
    const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
      date
    );
    const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(
      date
    );

    return `${month} ${day} ${dayOfWeek}`;
  };

  const formatIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (format === 'time') {
    return new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
      timeZone: 'Asia/Bangkok',
    }).format(dateTime);
  } else if (format === 'fullDate') {
    return formatFullDate(dateTime);
  } else if (format === 'ISOdate') {
    return formatIsoDate(dateTime);
  } else {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dateTime);
  }
};
