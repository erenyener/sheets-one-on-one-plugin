function onOpen() {
    const ui = SpreadsheetApp.getUi();

    // ui.createMenu('1-1')
    //     .addItem('First Setup', 'createOneToOne')
    //     .addToUi();
}

function isFirstSetupCompleted() {

    try{
        const settingsSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAMES.Settings);
        return settingsSheet ? true : false;
        
    }
    catch(e){
        Logger.log("Settings Sheet can not be found.");
    }
    
    //SHEET_NAMES.Settings
}