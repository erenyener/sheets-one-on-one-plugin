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
        .setWidth(1100)
        .setHeight(700);

    SpreadsheetApp.getUi().showModalDialog(template, 'First Setup');
}

function isFirstSetupCompleted() {
    try {
        const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.Settings);
        return settingsSheet ? true : false;

    }
    catch (e) {
        Logger.log("Settings Sheet can not be found.");
    }

}