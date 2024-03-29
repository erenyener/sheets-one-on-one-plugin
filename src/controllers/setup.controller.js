function processForm(data) {

    if (!data) {
        return false;
    }

    createOneOnOneSheet(data);
    setUserSettings(data);
    return true;
}

function createOneOnOneSheet(formData) {
    const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    const oneOnOneSheet = spreadSheet.insertSheet();
    oneOnOneSheet.setName(SHEET_NAMES.OneToOnes);

    
    setOneonOneSheetHeaders(oneOnOneSheet, formData.headers);
    addPeopleToOneOnOneSheet(oneOnOneSheet, formData.people);
    setOneOneOneSheetStyles(oneOnOneSheet);
}

function setUserSettings(formData) {
    
    const documentProperties = PropertiesService.getDocumentProperties();

    documentProperties.setProperty('CYCLE_TIME', formData.cycletime);
    documentProperties.setProperty('FIRST_SETUP', "true");


}

function setOneonOneSheetHeaders(oneOnOneSheet, customHeaders) {
    customHeaders.shift();
    const defaultHeaders = ["Last 1-1 Date (YYYY-MM-DD)", "SpreadSheet", "1-1 Status", "Days Left for Next 1-1"]
    const allHeaders = ["Name", ...customHeaders.map(w => w.charAt(0).toUpperCase() + w.slice(1)), ...defaultHeaders.map(w => w.charAt(0).toUpperCase() + w.slice(1))]

    oneOnOneSheet.appendRow(allHeaders);

}

function addPeopleToOneOnOneSheet(oneOnOneSheet, people) {
    people.forEach(person => {
        if(person.length > 0) {
            let row = [person[0]];
            if(person.length > 1) {
                for(let i = 1; i<person.length; i++) {
                    row.push(person[i]);
                }
            }
            row.push(""); row.push(""); row.push(""); row.push(0);
            if(!!row[0] && row[0].length > 0){
                oneOnOneSheet.appendRow(row);
            }
            
        }
    });
}

function setOneOneOneSheetStyles(oneOnOneSheet) {
    
    oneOnOneSheet.setHiddenGridlines(true);
    oneOnOneSheet.autoResizeColumns(1, oneOnOneSheet.getLastColumn());


    const allRange = oneOnOneSheet.getRange(1, 1, oneOnOneSheet.getLastRow(), oneOnOneSheet.getLastColumn());
    allRange.setFontFamily("Calibri").setFontSize(10);
    allRange.setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);

    const headersRange = oneOnOneSheet.getRange(1, 1, 1, oneOnOneSheet.getLastColumn());
    headersRange.setFontWeight("bold")
    headersRange.setBackgroundRGB(252, 229, 205);
    allRange.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);
}
