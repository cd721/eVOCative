const exportedMethods = {
  dateIsNotToday(date) {
    // //set hours to 0 to compare days
    // date.setHours(0, 0, 0, 0);
    let today = new Date();
    // today.setHours(0, 0, 0, 0);

    return date.getDate() !== today.getDate();
  },

  dateIsNotYesterday(date) {
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0); 
  
    let today = new Date();
    today.setHours(0, 0, 0, 0);
  
    let yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
  
    // Compare input date to yesterday's date.
    return inputDate.getTime() !== yesterday.getTime();
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
