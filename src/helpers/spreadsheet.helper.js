function SpreadSheetHelper() { }

SpreadSheetHelper.prototype.create = function (title, sheetName, editors) {
    try {
        const file = SpreadsheetApp.create(title);

        if (file) {

            if (editors && editors.length > 0) {
                file.addEditors(editors);
            }

            const sheet = file.getActiveSheet();
            if (sheet && sheetName.length > 0) {
                sheet.setName(sheetName);
            }

            const url = file.getUrl();
            return url;
        }
        else {
            Logger.log("An error occured in SpreadSheetHelper create. Error:  file can't be created")
        }
    }
    catch (e) {
        Logger.log("An error occured in SpreadSheetHelper create. Error: " + e)
    }

    return null;
}

