
function CellHelper() { }


CellHelper.prototype.getCellValue = function(row, col, sheetName) {

    const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);

    if (sheet) {

        try {
            const value = sheet.getRange(row, col).getValue();
            return value;
        }
        catch (e) {
            Logger.log("An error occured in CellHelper getCellValue. Error: " + e)
            return null;
        }

    }

    Logger.log("An error occured in Range Helper getCellValue. Error: Sheet can't be found")

    return null;
}

CellHelper.prototype.setCellValue = function(row, col, value, sheetName) {
    const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);

    if (sheet) {
        try {
            sheet.getRange(row, col).setValue(value)
        }
        catch (e) {
            Logger.log("An error occured in CellHelper setCellValue. Error: " + e)
        }
    }
}

CellHelper.prototype.setCellBackgroundColor = function(row, col, color, sheetName) {
    const sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);

    if (sheet) {
        try {
            sheet.getRange(row, col).setBackground(color)
        }
        catch (e) {
            Logger.log("An error occured in CellHelper setCellBackgroundColor. Error: " + e)
        }
    }
}