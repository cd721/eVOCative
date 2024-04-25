const exportedMethods = {
  dateIsBeforeToday(date) {
    //set hours to 0 to compare days
    date.setHours(0, 0, 0, 0);
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    return date < today;
  },
};
export default exportedMethods;
