function processFormOneOnOne(formObject) {

    const oneOnOneService = new OneOnOneService();
    const cellHelper = new CellHelper();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('1-1s');
    const lastColumn = sheet.getLastColumn();
    const userProperties = PropertiesService.getUserProperties();
    
    if(!formObject) {
      return false;
    }
    
    const result = oneOnOneService.saveOneToOne(formObject);

    if(result.isSuccess) {
        cellHelper.setCellValue(result.personRowNumber, lastColumn-1, result.oneOnOneStatus, SHEET_NAMES.OneToOnes);
        cellHelper.setCellValue(result.personRowNumber, lastColumn-3, result.savedDate, SHEET_NAMES.OneToOnes);
        cellHelper.setCellValue(result.personRowNumber, lastColumn, userProperties.getProperty('CYCLE_TIME'), SHEET_NAMES.OneToOnes);
    }

    return true;
  }

  