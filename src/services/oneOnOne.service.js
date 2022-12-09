function OneOnOneService() { }

OneOnOneService.prototype.createInitialOneToOneSpreadSheet = function(personName) {
    const spreadSheetHelper = new SpreadSheetHelper();
    const url = spreadSheetHelper.create(personName, "initial", ["mehmeterenyener@gmail.com"]);
    return url;
}