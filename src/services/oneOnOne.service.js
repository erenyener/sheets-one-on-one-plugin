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