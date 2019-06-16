window.onload = () =>{
    'use strict';
    const csInterface = new CSInterface();
    themeManager.init();

    const getObjects = document.getElementById("getObjects");
    const reload = document.getElementById("reload");
    const getImg = document.getElementById("getImg");
    const colorData = document.getElementById("colorData");
    
    const itemList = document.getElementById("itemList");
    const placedimagesList = document.getElementById("placedimagesList");
    const embedimagesList = document.getElementById("embedimagesList");
    const colorList = document.getElementById("colorList");
    
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    const getItems = "Objects.jsx";
    const getImages = "Images.jsx";
    const colorJsx = "getColorProperty.jsx";
    /* 
    getObjects.addEventListener("click",()=>{
        csInterface.evalScript(`$.evalFile("${extensionRoot + getItems}")`,(o)=>{
            const objects = JSON.parse(o);
            console.log(objects);
        });
    });
    
    getImg.addEventListener("click",()=>{
        csInterface.evalScript(`$.evalFile("${extensionRoot + getImages}")`,(o)=>{
            const Objects = JSON.parse(o);
            console.log(Objects);
        });
    });
       
    const RGB = ["R","G","B"];
    const CMYK = ["C","M","Y","K"];
    colorData.addEventListener("click",()=>{
            ( async()=>{
            const objects = await ObjectFromJsx(colorJsx);
            while(colorList.firstChild){
                colorList.removeChild(colorList.firstChild);
            }    
            const tr = document.createElement("tr");
            colorList.appendChild(tr);
            tr.appendChild(makeHeadLine("type"));
            if(objects.colorType === "DocumentColorSpace.RGB"){
                RGB.forEach(v=>{
                    tr.appendChild(makeHeadLine(v));
                });
                objects.fillColors.forEach(value=>{
                    const trLine = document.createElement("tr");
                    colorList.appendChild(trLine);
                    if(isNull(value)){
                        trLine.appendChild(makeHeadLine("nothing"));
                        return;
                    }
                    trLine.appendChild(makeHeadLine(value.type));
                    if(value.type==="RGBColor"){
                        [value.data.R,value.data.G,value.data.B].forEach(RGBValue=>{
                            trLine.appendChild(makeHeadLine(RGBValue));
                        });
                    }
                });
            }
        })();
        
    });
    */
    class GetDocumentData{
        constructor(table,path,btn){
            this.table = table;
            this.path = path;
            this.btn = btn;
        }
        
        objectFromJsx(path){
            return new Promise((resolve)=>{
                csInterface.evalScript(`$.evalFile("${extensionRoot}${path}")`,(o)=>{
                    const Objects = JSON.parse(o);
                    console.log(Objects);
                    resolve(Objects);
                });
            });
        }
        
        removeTable(){
            while(this.table.firstChild){
                this.table.removeChild(this.table.firstChild);
            } 
        }
        
        makeHeadLine(text,elm){
            const td = document.createElement(elm);
            td.textContent = text;
            return td;
        }
    }
    
    class ImageAnalyze extends GetDocumentData{
        constructor(path,btn){
            super(undefined,path,btn);
            this.placed = placedimagesList;
            this.embed = embedimagesList;
            this.prop = ["name","ext","data","fullName"];
            this.btn.addEventListener("click",this);
        }
        
        async handleEvent(){
            const objects = await this.objectFromJsx(this.path);
            [this.placed,this.embed].forEach(tables=>{
                while(tables.firstChild){
                    tables.removeChild(tables.firstChild);
                }
                const tr = document.createElement("tr");
                tables.appendChild(tr);
                this.prop.forEach(elms=>{
                    tr.appendChild(this.makeHeadLine(elms,"th"));
                });
                this.writeTable(objects.placed,tables);
                this.writeTable(objects.embed,tables);
            });
        }
        
        writeTable(array,table){
            array.forEach(objects=>{
                const tr = document.createElement("tr");
                table.appendChild(tr);
                tr.appendChild(this.makeHeadLine(objects.name,"td"));
                tr.appendChild(this.makeHeadLine(objects.ext,"td"));
                tr.appendChild(this.makeHeadLine(writeDate(objects.date),"td"));
                tr.appendChild(this.makeHeadLine(objects.fullName,"td"));
            });
            function writeDate(obj){
                return `${obj.year}Y:${obj.month}M:${obj.date}D:${obj.hours}H:${obj.minutes}M:${obj.seconds}S:`;
            }
        }
    }
    const imgAnalyze = new ImageAnalyze(getImages,getImg);
    
    class AllColordata extends GetDocumentData{
        constructor(path,btn,table){
            super(table,path,btn);
            this.btn.addEventListener("click",this);
        }
        
        async handleEvent(){
            const objects = await this.objectFromJsx(colorJsx);
            this.removeTable();
            const tr = document.createElement("tr");
            this.table.appendChild(tr);
            tr.appendChild(this.makeHeadLine("type","th"));
            let colorElms = [];
            let noneValues = [];
            if(objects.colorType === "DocumentColorSpace.RGB"){
                colorElms = ["R","G","B"];
                noneValues = Array(3).fill("none");
            }
            if(objects.colorType === "DocumentColorSpace.CMYK"){
                colorElms = ["C","M","Y","K"];
                noneValues = Array(4).fill("none");
            }
                colorElms.forEach(v=>{
                    tr.appendChild(this.makeHeadLine(v,"th"));
                });
                objects.fillColors.forEach(value=>{
                    const trLine = document.createElement("tr");
                    this.table.appendChild(trLine);
                    if(isNull(value)){
                        trLine.appendChild(this.makeHeadLine("nothing","td"));
                        noneValues.forEach(v=>{
                            trLine.appendChild(this.makeHeadLine(v,"td"));
                        });
                        return;
                    }else{
                        trLine.appendChild(this.makeHeadLine(value.type,"td"));
                    }
                    
                    if(value.type === "RGBColor"){
                        [value.data.R,value.data.G,value.data.B].forEach(RGBValue=>{
                            trLine.appendChild(this.makeHeadLine(RGBValue,"td"));
                        });
                    }
                    if(value.type === "CMYKColor"){
                        [value.data.C,value.data.M,value.data.Y,value.data.K].forEach(CMYKValue=>{
                            trLine.appendChild(this.makeHeadLine(CMYKValue,"td"));
                        });
                    }
                    if(value.type !== "CMYKColor"&&value.type !== "RGBColor"){
                        noneValues.forEach(v=>{
                            trLine.appendChild(this.makeHeadLine(v,"td"));
                        });
                    }
                });
            
        }
    }
    
    class GetObjectsType extends GetDocumentData{
        constructor(table,path,btn){
            super(table,path,btn);
            this.btn.addEventListener("click",this);
        }
        
        async handleEvent(){
            const items = await this.objectFromJsx(this.path);
            this.removeTable();
            const tr = document.createElement("tr");
            this.table.appendChild(tr);
            const th = document.createElement("th");
            th.textContent = "object type";
            tr.appendChild(th);
            items.forEach(v=>{
                const trLine = document.createElement("tr");
                this.table.appendChild(trLine);
                trLine.appendChild(this.makeHeadLine(v));
            });
        }
    }
    const objectsType = new GetDocumentData(itemList,getItems,getObjects);
    const fillColors = new AllColordata(colorJsx,colorData,colorList);
    
    
    reload.addEventListener("click",()=>{
        window.location.reload();
    });
    
    function isNull(obj){
        return obj === null;
    }
}
    
