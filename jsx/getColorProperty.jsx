(function(){
    /*
    var color = app.activeDocument.selection[0];
    for( key in color.fillColor){
        try{
            $.writeln(key);
            $.writeln(color.fillColor[key]);
        }catch(e){

        }
    }
    */
    layerUnlock(activeDocument);
    var p = activeDocument.pageItems;
    for(var i=0;i < p.length;i++){
        try{
            p[i].selected = true;
        }catch(e){
            p[i].locked = false;
            p[i].selected = true;
        }
    }
    function layerUnlock(lay){
        for(i=0;i<lay.length;i++){
            if(!lay.layers[i].visible){
                continue;
            }
            lay.layers[i].locked = false;
            if(lay.layers.length > 0){
                layerUnlock(lay.layers[i]);
            }
        }
    }
    

    function ColorItems(){
        this.colorType = app.activeDocument.documentColorSpace.toString();//object型をstringに変換
        this.fillColors =[];
    } 
    ColorItems.prototype.getItems = function(){
        selObj = app.activeDocument.selection;
        for(var i=0;i<selObj.length;i++){
            if(!selObj[i].fillColor){//色情報がなければcontinue
                continue;
            }
            this.fillColors[i] = {};
            this.fillColors[i].data = {};
            this.fillColors[i].type = selObj[i].fillColor.typename;
            if(isCMYK(selObj[i].fillColor)){
                this.fillColors[i].data = getCMYK(selObj[i].fillColor);
            }
            if(isRGB(selObj[i].fillColor)){
                this.fillColors[i].data = getRGB(selObj[i].fillColor);
            }
            for( p in this.fillColors[i].data){
                $.writeln(p);
                $.writeln(this.fillColors[i].data[p]);
            }

        }

       

        function isRGB(color){
            return (color.red || color.green || color.blue);
        }

        function isCMYK(color){
            return (color.cyan||color.magenta||color.yellow||color.black);
        }

        function getRGB(color){
            return {R:color.red,G:color.green,B:color.blue};
        }
        function getCMYK(color){
            return {C:color.cyan,M:color.magenta,Y:color.yellow,K:color.black};
        }
    }
    var c = new ColorItems();
    c.getItems();
    return JSON.stringify(c);
})();