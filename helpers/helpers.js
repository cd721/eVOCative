const exportedMethods = {
  dateIsNotToday(date) {
    // //set hours to 0 to compare days
    // date.setHours(0, 0, 0, 0);
    let today = new Date();
    // today.setHours(0, 0, 0, 0);

    return date.getDate() !== today.getDate();
  },

  dateIsNotYesterday(date) {
    //set hours to 0 to compare days
    // date.setHours(0, 0, 0, 0);
    let today = new Date();
    let yesterday = today.setDate(today.getDate() - 1);
    // yesterday.setHours(0, 0, 0, 0);

    return date.getDate() !== yesterday.getDate();
  },

  dateIsToday(date) {
    //set hours to 0 to compare days
    // date.setHours(0, 0, 0, 0);
    let today = new Date();
    // today.setHours(0, 0, 0, 0);

    return date.getDate() === today.getDate();
  },
};
export default exportedMethods;
