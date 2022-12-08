function onOpen() {
    renderMenu(isFirstSetupCompleted());
}

function renderMenu(isFirstSetupCompleted) {

    const ui = SpreadsheetApp.getUi();

    if (!isFirstSetupCompleted) {
        ui.createMenu('1-1')
            .addItem('First Setup', 'firstSetup')
            .addToUi();
    }
    else {
        ui.createMenu('1-1')
            .addItem('Do 1-1', 'createOneToOne')
            .addToUi();
    }
}

function firstSetup() {

    const firstSetupHtml = HtmlService
        .createTemplateFromFile('src/views/first-setup')
        .evaluate()
        .getContent();

    const template = HtmlService.createTemplate(firstSetupHtml)
        .evaluate()
        .setWidth(600)
        .setHeight(300);

    SpreadsheetApp.getUi().showModalDialog(template, 'First Setup');
}

function createOneToOne() {
    const ui = SpreadsheetApp.getUi();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('1-1s');
    const range = sheet.getActiveRange();
    const cellHelper = new CellHelper();
    const oneOnOneService = new OneOnOneService();

    const col = range.getColumn()
    const row = range.getRow()

    const personName = getName(col, row);

    if (personName) {
        const personSpreadSheetColumnIndex = sheet.getLastColumn() - 2;
        let personSpreadSheetLink = getOneToOneSpreadSheetLink(row, personSpreadSheetColumnIndex);

        if(!personSpreadSheetLink) {
            
            const oneToOneSpreadSheetLink = oneOnOneService.createInitialOneToOneSpreadSheet(personName);
            personSpreadSheetLink = oneToOneSpreadSheetLink;
            if(!oneToOneSpreadSheetLink) {
              Logger.log("An error occured in OneToOneController onPersonClick. Error: sheet can't be created")
              return; 
            }
            
            cellHelper.setCellValue(row, personSpreadSheetColumnIndex, oneToOneSpreadSheetLink, SHEET_NAMES.OneToOneSheetName);
            
          }
    }
    else {
        ui.alert("Please select person from the table then click do 1-1")
    }

}

function isFirstSetupCompleted() {
    try {
        const userProperties = PropertiesService.getUserProperties();
        const firstSetupDone = userProperties.getProperty('FIRST_SETUP')
        const firstSetupCompleted = firstSetupDone === "true";
        return firstSetupCompleted;
    }
    catch (e) {
        Logger.log("Settings Sheet can not be found.");
    }
}

function getName(row, col) {
    const ui = SpreadsheetApp.getUi();
    const cellHelper = new CellHelper();

    ui.alert(row)
    ui.alert(col)
    if (col === 1 && row > 0) {
        ui.alert("İf")
        const name = cellHelper.getCellValue(row, col, SHEET_NAMES.OneToOneSheetName);
        ui.alert(name)
        return name;
    }
    ui.alert("not if")
    Logger.log("An error occured in OneToOneController onPersonClick. Error: col should be 1 and row should be greater than 1");
    return null;
}

function getOneToOneSpreadSheetLink(row, spreadSheetColumnIndex) {
    const cellHelper = new CellHelper();
    const spreadSheetUrl = cellHelper.getCellValue(row, spreadSheetColumnIndex, SHEET_NAMES.OneToOneSheetName);
    const isValid = this.urlHelper.validURL(spreadSheetUrl);

    if (isValid) {
        return spreadSheetUrl;
    }

    Logger.log("An error occured in OneToOneController _getOneToOneSpreadSheet. Error: Url is empty or invalid");
    return null;

}