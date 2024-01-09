//retrieve and format current time/date
const currentTime = dayjs();
const currentTimeFormatted = currentTime.format("dddd, MMMM D");
$("#todays-date").text(currentTimeFormatted);

