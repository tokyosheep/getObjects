(function(){
    function GetImages(){
        this.placed = [];
        this.embed = [];
        this.placedLength = activeDocument.placedItems.length;
        this.embedLength = activeDocument.rasterItems.length;
    }

    GetImages.prototype.getPath = function(items){
        var obj = { fullName:"",
                    name:"",
                    ext:"",
                    date:{}
        };
        var fileObj = items.file;
        obj.fullName = decodeURI(fileObj.fullName);
        obj.name = decodeURI(fileObj.name);
        var splitComma = fileObj.name.split(".");
        $.writeln(splitComma[splitComma.length-1]);
        obj.ext = splitComma[splitComma.length-1].toLowerCase();
        obj.date = this.getDate(items);
        return obj;
    }

GetImages.prototype.getDate = function(items){
    var obj = {
        year:"",
        month:"",
        date:"",
        hours:"",
        minutes:"",
        seconds:""
    };
    var dateObj = items.file.modified;
    obj.year = dateObj.getFullYear();
    obj.month = dateObj.getMonth();
    obj.date = dateObj.getDate();
    obj.hours = dateObj.getHours();
    obj.minutes = dateObj.getMinutes();
    obj.seconds = dateObj.getSeconds(); 
    
    return obj;
}

    var images = new GetImages();
    for(var i=0;i<images.placedLength;i++){
        images.placed[i] = images.getPath(activeDocument.placedItems[i]);
        $.writeln(images.placed[i].name);
    }
    for(var i=0;i<images.embedLength;i++){
        images.embed[i] = images.getPath(activeDocument.rasterItems[i]);
    }
    return JSON.stringify(images);
})();