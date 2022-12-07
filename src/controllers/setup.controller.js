function processForm(data) {

    if (!data) {
        return false;
    }

    const spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    const oneOnOneSheet = spreadSheet.insertSheet()
    oneOnOneSheet.setName(SHEET_NAMES.OneToOnes);

    
    setOneonOneSheetHeaders(oneOnOneSheet, data.headers)
    addPeopleToOneOnOneSheet(oneOnOneSheet, data.people)
    setOneOneOneSheetStyles(oneOnOneSheet)
    
    
    return true;
}

function setOneonOneSheetHeaders(oneOnOneSheet, customHeaders) {
    customHeaders.shift();
    const defaultHeaders = ["Last 1-1 Date", "SpreadSheet", "1-1 Status", "Days Left for Next 1-1"]
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
            row.push(""); row.push(""); row.push(""); row.push("");
            oneOnOneSheet.appendRow(row);
        }
    });
}

function setOneOneOneSheetStyles(oneOnOneSheet) {
    
    oneOnOneSheet.setHiddenGridlines(true);
    oneOnOneSheet.autoResizeColumns(1, oneOnOneSheet.getLastColumn());

    const headersRange = oneOnOneSheet.getRange(1, 1, 1, oneOnOneSheet.getLastColumn());
    const headerDataRange = headersRange.getDataRange()
    headerDataRange.setFontFamilyAndWeight('Calibri', 600).setFontSize('11')
    headersRange.setBackgroundRGB(252, 229, 205);
    headersRange.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);
}



/*

Create 1-1 sheet
Add Headers
Add People

Create Settings Sheet
Add CycleTime
Hide Settings Sheeet

const data = {
    cycletime: 12,
    customFields: ['asdasd', 'asdasdasdasd'],
    headers: ['name', 'asdasd', 'asdasdasdasd'],
    people:
        [['Eren', 'yener', 'test'],
        ['Eren', 'yener3', 'testss'],
        ['']]
}

*/