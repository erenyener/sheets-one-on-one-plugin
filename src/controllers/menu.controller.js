function onOpen() {
    const firstSetupCompleted = isFirstSetupCompleted();
    
    renderMenu();

    if (firstSetupCompleted) {
        setRemainingDatesForNextOneOnOne();
    }

}

function renderMenu() {

    const ui = SpreadsheetApp.getUi();

    ui.createMenu('1-1 Helper')
        .addItem('Setup', 'firstSetup')
        .addItem('Do 1-1', 'createOneToOne')
        .addSubMenu(ui.createMenu('Help')
          .addItem('Help 1', 'menuItem2')
          .addItem('Help 1', 'menuItem2'))
        .addToUi();
}

function firstSetup() {

    const firstSetupCompleted = isFirstSetupCompleted();
    
    if(firstSetupCompleted) {
        const ui = SpreadsheetApp.getUi();

    }

    
    const firstSetupHtml = HtmlService
        .createTemplateFromFile('src/views/first-setup')
        .evaluate()
        .getContent();

    const template = HtmlService.createTemplate(firstSetupHtml)
        .evaluate()
        .setWidth(MODAL_SETTINGS.FirstSetup.width)
        .setHeight(MODAL_SETTINGS.FirstSetup.height);

    SpreadsheetApp.getUi().showModalDialog(template, 'Setup');
}

function createOneToOne() {
    const ui = SpreadsheetApp.getUi();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.OneToOnes);
    const range = sheet.getActiveRange();
    const cellHelper = new CellHelper();
    const oneOnOneService = new OneOnOneService();

    const col = range.getColumn()
    const row = range.getRow()

    const personName = getName(col, row);

    if (personName) {
        const personSpreadSheetColumnIndex = sheet.getLastColumn() - 2;
        let personSpreadSheetLink = getOneToOneSpreadSheetLink(row, personSpreadSheetColumnIndex);

        if (!personSpreadSheetLink) {

            const oneToOneSpreadSheetLink = oneOnOneService.createInitialOneToOneSpreadSheet(personName);
            personSpreadSheetLink = oneToOneSpreadSheetLink;
            if (!oneToOneSpreadSheetLink) {
                Logger.log("An error occured in OneToOneController onPersonClick. Error: sheet can't be created")
                return;
            }

            cellHelper.setCellValue(row, personSpreadSheetColumnIndex, oneToOneSpreadSheetLink, SHEET_NAMES.OneToOnes);
        }

        const lastOneToOne = oneOnOneService.getLastOneToOne(personSpreadSheetLink);
        openOneToOneModal(personName, row, lastOneToOne, personSpreadSheetLink);
    }
    else {
        ui.alert("Please select person from the table then click do 1-1")
    }

}

function help() {
    
}

function setRemainingDatesForNextOneOnOne() {

    const dateTimeHelper = new DateTimeHelper();
    const cellHelper = new CellHelper();
    const userProperties = PropertiesService.getUserProperties();
    const cycletime = parseInt(userProperties.getProperty('CYCLE_TIME');
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.OneToOnes);
    const lastColumn = sheet.getLastColumn();
    const peopleRange = sheet.getRange(2, 1, sheet.getLastRow(), lastColumn);
    const peopleDatas = peopleRange.getValues();

    peopleDatas.forEach((personData, index) => {

        const person = {
            name: personData[0],
            lastOneToOneDate: personData[lastColumn - 4]
        };

        const remainingDaysToNextOneOnOne = person.lastOneToOneDate 
            ? dateTimeHelper.getDayDifferenceBetweenDates(person.lastOneToOneDate, new Date()) 
            : cycletime;

        Logger.log("----");
        Logger.log(person.name)
        Logger.log(remainingDaysToNextOneOnOne)
        Logger.log(cycletime)
        Logger.log("----");

        if (person.name) {
            const remainingDays = isNaN(remainingDaysToNextOneOnOne) ? 0 : (cycletime - remainingDaysToNextOneOnOne);
            cellHelper.setCellValue(index + 2, lastColumn, remainingDays, SHEET_NAMES.OneToOnes);
        }
    })
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

function getName(col, row) {

    const cellHelper = new CellHelper();

    if (parseInt(col) === 1 && parseInt(row) > 1) {
        const name = cellHelper.getCellValue(row, col, SHEET_NAMES.OneToOnes);
        return name;
    }
    Logger.log("An error occured in OneToOneController onPersonClick. Error: col should be 1 and row should be greater than 1");
    return null;
}

function getOneToOneSpreadSheetLink(row, spreadSheetColumnIndex) {
    const cellHelper = new CellHelper();
    const urlHelper = new UrlHelper();

    const spreadSheetUrl = cellHelper.getCellValue(row, spreadSheetColumnIndex, SHEET_NAMES.OneToOnes);
    const isValid = urlHelper.validURL(spreadSheetUrl);

    if (isValid) {
        return spreadSheetUrl;
    }

    Logger.log("An error occured in OneToOneController _getOneToOneSpreadSheet. Error: Url is empty or invalid");
    return null;
}

function openOneToOneModal(personName, row, lastOneToOne, spreadSheetLink) {
    const data = { personName: personName, row: row, lastOneToOne: lastOneToOne, spreadSheetLink: spreadSheetLink };

    const modalHtml = HtmlService
        .createTemplateFromFile('src/views/one-one-modal')
        .evaluate()
        .getContent();

    const template = HtmlService.createTemplate(modalHtml +
        "<script>window.stringifiedData = " + JSON.stringify(data) + "</script>")
        .evaluate()
        .setWidth(MODAL_SETTINGS.OneOnOne.width)
        .setHeight(MODAL_SETTINGS.OneOnOne.height);


    SpreadsheetApp.getUi().showModalDialog(template, 'Do 1-1 with (' + personName + ')');
}