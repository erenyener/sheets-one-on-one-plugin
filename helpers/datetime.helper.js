function DateTimeHelper() { }

DateTimeHelper.prototype.getCurrentDate =  function() {
    let date = new Date().toLocaleDateString("tr", {year:"numeric", day:"2-digit", month:"2-digit"});
    return date;
  }
  
  DateTimeHelper.prototype.getCurrentDateWithHourAndMinute = function() {
    let date = new Date().toLocaleDateString("tr", {year:"numeric", day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit"});
    
    return date;
  }
  
  DateTimeHelper.prototype.getCurrentDateWithHourAndMinuteAndSeconds = function() {
    let date = new Date().toLocaleDateString("tr", {year:"numeric", day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit", second:"2-digit"});
    
    return date;
  }
  
  DateTimeHelper.prototype.getDayDifferenceBetweenDates = function(date1, date2) {
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
    return diffDays;
  }
  
  