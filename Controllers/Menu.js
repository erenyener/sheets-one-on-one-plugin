function onOpen() {
    const ui = SpreadsheetApp.getUi();

    ui.createMenu('1-1')
        .addItem('First Setup', 'createOneToOne')
        .addItem('Sort by Status', 'sortByScore')
        .addItem('Set Actions', 'setActions')
        .addToUi();
}

function isFirstSetupCompleted() {
    
    //SHEET_NAMES.Settings
}