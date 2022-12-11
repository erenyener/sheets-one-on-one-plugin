function OneOnOneService() { }

OneOnOneService.prototype.createInitialOneToOneSpreadSheet = function(personName) {
    const spreadSheetHelper = new SpreadSheetHelper();
    const url = spreadSheetHelper.create(personName, "initial", ["mehmeterenyener@gmail.com"]);
    return url;
}

OneOnOneService.prototype.getLastOneToOne = function(spreadSheetLink) {
    const spreadSheet = SpreadsheetApp.openByUrl(spreadSheetLink);
    const sheets = spreadSheet.getSheets()

    if(sheets.length === 1 && sheets[0].getName() === "initial") {
      return false;
    }

    if(sheets.length > 0) {
      const lastOneToOneSheet = sheets[0];
      const lastRow = lastOneToOneSheet.getLastRow();
      
      const topOfMind = lastOneToOneSheet.getRange(2, 1, 1, 1).getValue();
      const generalMood = lastOneToOneSheet.getRange(2, 2, 1, 1).getValue();
      const learnings = lastOneToOneSheet.getRange(2, 3, 1, 1).getValue();
      const roadBlocks = lastOneToOneSheet.getRange(2, 4, 1, 1).getValue();
      const careerDevelopment = lastOneToOneSheet.getRange(2, 5, 1, 1).getValue();
      const teamDynamics = lastOneToOneSheet.getRange(2, 6, 1, 1).getValue();
      const notes = lastOneToOneSheet.getRange(2, 7, lastRow, 1).getValues();
      const actions = lastOneToOneSheet.getRange(2, 8, lastRow, 1).getValues();
      const feedbacks = lastOneToOneSheet.getRange(2, 9, lastRow, 1).getValues();

      return {
        topOfMind: topOfMind,
        generalMood: generalMood,
        learnings: learnings,
        roadBlocks: roadBlocks,
        careerDevelopment: careerDevelopment,
        teamDynamics: teamDynamics,
        notes: notes.filter(i=> i.length > 0),
        actions: actions.filter(i=> i.length > 0),
        feedbacks: feedbacks.filter(i=> i.length > 0)
      }
    }
    else {
      return false;
    }
  }

  OneOnOneService.prototype.saveOneToOne = function(formObject) {
    
    const dateTimeHelper = new DateTimeHelper();
    const spreadSheet = SpreadsheetApp.openByUrl(formObject.spreadSheetLink);
    const currentDate = dateTimeHelper.getCurrentDateWithHourAndMinuteAndSeconds();
    const sheet = spreadSheet.insertSheet(currentDate, 0);
    
    
    const appendList = getOneToOneAppendList(formObject);
    
    appendList.forEach((row) => {
      sheet.appendRow(row);
    }) 

    const oneToOneStatus = calculateOneToOneStatus(formObject);
    setOneToOneSheetStyles(sheet);

    return {
        isSuccess: true,
        personRowNumber : formObject.row,
        oneOnOneStatus: oneToOneStatus,
        savedDate: currentDate
    }
  }

  function getOneToOneAppendList(formObject) {

    let appendList = [];
    const notesLength = formObject.notes.length;
    const actionsLength = formObject.actions.length
    const feedbacksLength = formObject.feedbacks.length
    const loopLength = Math.max(notesLength, actionsLength, feedbacksLength);

    appendList.push(["Top Of Mind", "General Mood", "Learnings", "Road Blocks", "Career Development", "Team Dynamics", "Notes", "Actions", "Feedbacks"]);
    for(let i=0; i<loopLength; i++){
      
      if(i === 0) {
        const firstAction = formObject.actions.length > 0 ? formObject.actions[i] : "";
        const firstNote = formObject.notes.length > 0 ? formObject.notes[i] : "";
        const firstFeedback = formObject.feedbacks.length > 0 ? formObject.feedbacks[i] : "";
        appendList.push([formObject.topOfMind, formObject.generalMood, formObject.learnings, formObject.roadBlocks, formObject.careerDevelopment, formObject.teamDynamics ,firstNote, firstAction, firstFeedback])
      }
      else {
        let otherAction = "";
        let otherNote = "";
        let otherFeedback = "";

        if(i < actionsLength) {
          otherAction = formObject.actions[i]
        }
        if(i < notesLength) {
          otherNote = formObject.notes[i]
        }
        if(i < feedbacksLength) {
          otherFeedback = formObject.feedbacks[i]
        }

        appendList.push(["", "", "", "", "", "", otherNote, otherAction, otherFeedback])
      }
    }

    return appendList;
  }

  function calculateOneToOneStatus(formObject) {
    
    if(formObject.generalMood == "Bored" || formObject.generalMood == "Anxious"){
      return "Poor";
    }
    else if(formObject.learnings == "Dissatisfying"){
      return "Poor";
    }
    else if(formObject.roadBlocks == "Dissatisfying"){
      return "Poor";
    }
    else if(formObject.careerDevelopment == "Dissatisfying"){
      return "Poor";
    }
    else if(formObject.teamDynamics == "Dissatisfying"){
      return "Poor";
    }
    else if(formObject.feedbacks.length > 2) {
      return "Poor";
    }
    else if(formObject.actions.length > 2) {
      return "Poor";
    }

    return "Good";

  }

  function setOneToOneSheetStyles(sheet){
    sheet.setHiddenGridlines(true);
    const lastColumn = sheet.getLastColumn();
    const lastRow = sheet.getLastRow();
    const firstRow = sheet.getRange(1, 1, 1, lastColumn);
    const allCells = sheet.getRange(1, 1, lastRow, lastColumn);
    firstRow.setBackground("#fce5cd");
    allCells.setBorder(true, null, true, null, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);

}
