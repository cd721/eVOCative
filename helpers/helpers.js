const exportedMethods = {
  dateIsNotToday(date) {
    // //set hours to 0 to compare days
    // date.setHours(0, 0, 0, 0);
    let today = new Date();
    // today.setHours(0, 0, 0, 0);

    return date.getDate() !== today.getDate();
  },

  dateIsNotYesterday(date) {
    let today = new Date();

    //For initialization purposes only
    let yesterday = new Date();

    //setDate returns nothing, this line sets yesterday to (today.getDate() - 1)
    yesterday.setDate(today.getDate() - 1);

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
