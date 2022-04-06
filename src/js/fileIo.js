function FileIO (mainVar) {  
   this.mainVar = mainVar
}  

 FileIO.prototype.writeDiagram = async function(fileHandle) { 
	   var obj;
				var contents = '{\n'; 
	   for (item in mainvar.items) {
					  obj = mainvar.items[item];
		    	if (contents != '{\n') { 
				      contents = contents + ','; 
			    }
				   contents = contents + "{\"type\":\"" + obj.type + "\",\"name\":\"" + obj.name + "\", \"x\":" + obj.x + ",\"y\":" + obj.y + "}"								
				} 
				contents = contents + '}\n';
	   this.mainVar.removeElements();					
				
	} 

 FileIO.prototype.readDiagram = async function () {
    var lines;
    var file = await fileHandle.getFile();
				var obj;
				
				this.mainVar.removeElements();
    contents = await file.text();
    lines = contents.split ( '\n' );
				var json = JSON.parse(contents);
				for (item in json.items) { 
				  obj = json.items[item];
				  console.log ( 'show: ' + obj.type + ' at: [' + obj.x + ',' + obj.y + ']' );
						this.mainVar.createSymbol ( obj.type, obj.name, obj.x, obj.y, obj.sourceName, obj.sourceIndex, obj.endName, obj.endIndex );
				} 
 }
 
 FileIO.prototype.getNewFileHandle = async function () {
  const options = {
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.txt'],
        },
      },
    ],
  };
  const handle = await window.showSaveFilePicker(options);
  return handle;
 }

 FileIO.prototype.writeFile = async function (fileHandle, contents) {
   // Create a FileSystemWritableFileStream to write to.
   const writable = await fileHandle.createWritable();
   // Write the contents of the file to the stream.
   await writable.write(contents);
   // Close the file and write the contents to disk.
   await writable.close();
 }
