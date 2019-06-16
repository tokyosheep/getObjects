(function(){
    function PlacedObjects(){
        this.objects = [];    
    }

    PlacedObjects.prototype.allSelect = function(){
        layerUnlock(activeDocument);
        var p = activeDocument.pageItems;
        for(var i=0; i<p.length;i++){
            try{
                p[i].selected = true;
            }catch(e){
                p[i].locked = false;
                p[i].selected = true;
            }finally{
                $.writeln("ss");
                $.writeln(p[i]);
            }
            this.objects[i] = activeDocument.pageItems[i].typename;
            //activeDocument.pageItems[i]だとオブジェクトが深すぎてスタック超過を起こす、、、
        }
        
    }

    function layerUnlock(lay){
        for(var i=0;i<lay.layers.length;i++){
            lay.layers[i].locked = false;
            if(lay.layers.length > 0){
                layerUnlock(lay.layers[i]);
            }
        }
    }

    var elements = new PlacedObjects();
    elements.allSelect();
    $.writeln(elements.objects);
    return JSON.stringify(elements.objects);
})();    