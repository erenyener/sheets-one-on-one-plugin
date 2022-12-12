function onOpen() {
    const firstSetupCompleted = isFirstSetupCompleted();
    renderMenu(firstSetupCompleted);

    if(firstSetupCompleted) {
        setRemainingDatesForNextOneOnOne();
    }

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

function setRemainingDatesForNextOneOnOne() {

    const dateTimeHelper = new DateTimeHelper();
    const cellHelper = new CellHelper();
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.OneToOnes);
    const lastColumn = sheet.getLastColumn();
    const peopleRange = sheet.getRange(2, 1, sheet.getLastRow(), lastColumn);
    const peopleDatas = peopleRange.getValues();

    peopleDatas.forEach((personData, index) => {

        Logger.log(personData)
        const person = {
            name: personData[0],
            lastOneToOneDate: personData[lastColumn - 4]
        };

        const globalDateForLastOneOnOne = new Date(person.lastOneToOneDate).toLocaleDateString('en-GB')
        const remainingDaysToNextOneOnOne = dateTimeHelper.getDayDifferenceBetweenDates(globalDateForLastOneOnOne, new Date());
        
        if(person.name) {
            cellHelper.setCellValue(index + 2, lastColumn, remainingDaysToNextOneOnOne, SHEET_NAMES.OneToOnes);
        }
    })
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
        .setWidth(1100)
        .setHeight(700);


    SpreadsheetApp.getUi().showModalDialog(template, 'Create 1-1 (' + personName + ')');
}