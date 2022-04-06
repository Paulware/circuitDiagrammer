		function main(container)
		{       
   
			this.items = [] 
			var graph = new mxGraph(container);
   this.graph = graph;
   theGraph = graph;
			graph.view.scale = 1;
			graph.setPanning(true);
			graph.setConnectable(true);
			graph.setConnectableEdges(true);
			graph.setDisconnectOnMove(false);
			graph.foldingEnabled = false;
			
			//Maximum size
			graph.maximumGraphBounds = new mxRectangle(0, 0, 800, 600)
			graph.border = 50;

			// Panning handler consumed right click so this must be
			// disabled if right click should stop connection handler.
			graph.panningHandler.isPopupTrigger = function() { return false; };
			
			// Enables return key to stop editing (use shift-enter for newlines)
			graph.setEnterStopsCellEditing(true);

			// Adds rubberband selection
			new mxRubberband(graph);
			
			// Alternative solution for implementing connection points without child cells.
			// This can be extended as shown in portrefs.html example to allow for per-port
			// incoming/outgoing direction.
			graph.getAllConnectionConstraints = function(terminal)
			{
			   var geo = (terminal != null) ? this.getCellGeometry(terminal.cell) : null;

			   if ((geo != null ? !geo.relative : false) &&
				   this.getModel().isVertex(terminal.cell) &&
				   this.getModel().getChildCount(terminal.cell) == 0)
			   {
					return [new mxConnectionConstraint(new mxPoint(0, 0.5), false),
				    	new mxConnectionConstraint(new mxPoint(1, 0.5), false)];
			    }

				return null;
			};

			// Makes sure non-relative cells can only be connected via constraints
			graph.connectionHandler.isConnectableCell = function(cell)
			{
				if (this.graph.getModel().isEdge(cell))
				{
					return true;
				}
				else
				{
					var geo = (cell != null) ? this.graph.getCellGeometry(cell) : null;
					
					return (geo != null) ? geo.relative : false;
				}
			};
			mxEdgeHandler.prototype.isConnectableCell = function(cell)
			{
				return graph.connectionHandler.isConnectableCell(cell);
			};
			
			// Adds a special tooltip for edges
			graph.setTooltips(true);
			
			var getTooltipForCell = graph.getTooltipForCell;
			graph.getTooltipForCell = function(cell)
			{
				var tip = '';
				
				if (cell != null)
				{
					var src = this.getModel().getTerminal(cell, true);
					
					if (src != null)
					{
						tip += this.getTooltipForCell(src) + ' ';
					}
					
					var parent = this.getModel().getParent(cell);
					theParent = parent;
					if (this.getModel().isVertex(parent))
					{
						tip += this.getTooltipForCell(parent) + '.';
					}
	
					tip += getTooltipForCell.apply(this, arguments);
					
					var trg = this.getModel().getTerminal(cell, false);
					
					if (trg != null)
					{
						tip += ' ' + this.getTooltipForCell(trg);
					}
				}

				return tip;
			};

			
			if (invert)
			{
				container.style.backgroundColor = 'black';
				
				// White in-place editor text color
				mxCellEditorStartEditing = mxCellEditor.prototype.startEditing;
				mxCellEditor.prototype.startEditing = function (cell, trigger)
				{
					mxCellEditorStartEditing.apply(this, arguments);
					
					if (this.textarea != null)
					{
						this.textarea.style.color = '#FFFFFF';					
					}
				};
				
				mxGraphHandler.prototype.previewColor = 'white';
			}
			
			var labelBackground = (invert) ? '#000000' : '#FFFFFF';
			var fontColor = (invert) ? '#FFFFFF' : '#000000';
			var strokeColor = (invert) ? '#C0C0C0' : '#000000';
			var fillColor = (invert) ? 'none' : '#FFFFFF';
			
			var style = graph.getStylesheet().getDefaultEdgeStyle();
			delete style['endArrow'];
			style['strokeColor'] = strokeColor;
			style['labelBackgroundColor'] = labelBackground;
			style['edgeStyle'] = 'wireEdgeStyle';
			style['fontColor'] = fontColor;
			style['fontSize'] = '9';
			style['movable'] = '0';
			style['strokeWidth'] = strokeWidth;
			//style['rounded'] = '1';
			
			// Sets join node size
			style['startSize'] = joinNodeSize;
			style['endSize'] = joinNodeSize;
			
			style = graph.getStylesheet().getDefaultVertexStyle();
			style['gradientDirection'] = 'south';
			//style['gradientColor'] = '#909090';
			style['strokeColor'] = strokeColor;
			//style['fillColor'] = '#e0e0e0';
			style['fillColor'] = 'none';
			style['fontColor'] = fontColor;
			style['fontStyle'] = '1';
			style['fontSize'] = '12';
			style['resizable'] = '0';
			style['rounded'] = '1';
			style['strokeWidth'] = strokeWidth;

			var parent = graph.getDefaultParent();
   
			graph.getModel().beginUpdate();
			try
			{
     this.createSolidState('S1',40,150);
     var v1 = this.createJ3 ('J1',80,40);
     var v2 = this.createResistor ( 'R1', 220, 220, 'left', 'right' );        
     var v3 = this.createJ3 ('J3', 420, 340);    	
     var e1 = this.connect ( 'e1', v1.getChildAt(7), v2.getChildAt(0), [new mxPoint (180,140)] ); 
     var e2 = this.connect ( 'e2', v1.getChildAt(4), v2.getChildAt(1), [new mxPoint(320,50), new mxPoint (320,140)] );     
     var e3 = this.connection ('crossover', e1, e2, new mxPoint (180,140), new mxPoint (290,140) );
     var e4 = this.connect ( 'e4', v2, v3.getChildAt(0), [new mxPoint(380, 230)] );
     var e5 = this.connect ( 'e5', v3.getChildAt(5), v1.getChildAt(0), [new mxPoint(500, 310), new mxPoint(500, 20), new mxPoint(50, 20)] );
     
			}
			finally
			{
				graph.getModel().endUpdate();
			}
			
			document.body.appendChild(mxUtils.button('Zoom In', function()
			{
				graph.zoomIn();
			}));
			
			document.body.appendChild(mxUtils.button('Zoom Out', function()
			{
				graph.zoomOut();
			}));
			
			// Undo/redo
			var undoManager = new mxUndoManager();
			var listener = function(sender, evt)
			{
				undoManager.undoableEditHappened(evt.getProperty('edit'));
			};
			graph.getModel().addListener(mxEvent.UNDO, listener);
			graph.getView().addListener(mxEvent.UNDO, listener);
			
			document.body.appendChild(mxUtils.button('Undo', function()
			{
				undoManager.undo();
			}));
			
			document.body.appendChild(mxUtils.button('Redo', function()
			{
				undoManager.redo();
			}));

			// Shows XML for debugging the actual model
			document.body.appendChild(mxUtils.button('Delete', function()
			{
				graph.removeCells();
			}));
			
			// Wire-mode
			var checkbox = document.createElement('input');
			checkbox.setAttribute('type', 'checkbox');
			
			document.body.appendChild(checkbox);
			mxUtils.write(document.body, 'Wire Mode');
			
			// Starts connections on the background in wire-mode
			var connectionHandlerIsStartEvent = graph.connectionHandler.isStartEvent;
			graph.connectionHandler.isStartEvent = function(me)
			{
				return checkbox.checked || connectionHandlerIsStartEvent.apply(this, arguments);
			};
			
			// Avoids any connections for gestures within tolerance except when in wire-mode
			// or when over a port
			var connectionHandlerMouseUp = graph.connectionHandler.mouseUp;
			graph.connectionHandler.mouseUp = function(sender, me)
			{
				if (this.first != null && this.previous != null)
				{
					var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
					var dx = Math.abs(point.x - this.first.x);
					var dy = Math.abs(point.y - this.first.y);

					if (dx < this.graph.tolerance && dy < this.graph.tolerance)
					{
						// Selects edges in non-wire mode for single clicks, but starts
						// connecting for non-edges regardless of wire-mode
						if (!checkbox.checked && this.graph.getModel().isEdge(this.previous.cell))
						{
							this.reset();
						}
						
						return;
					}
				}
				
				connectionHandlerMouseUp.apply(this, arguments);
			};
			
			// Grid
			var checkbox2 = document.createElement('input');
			checkbox2.setAttribute('type', 'checkbox');
			checkbox2.setAttribute('checked', 'true');
			
			document.body.appendChild(checkbox2);
			mxUtils.write(document.body, 'Grid');
			
			mxEvent.addListener(checkbox2, 'click', function(evt)
			{
				if (checkbox2.checked)
				{
					container.style.background = 'url(\'images/wires-grid.gif\')';
				}
				else
				{
					container.style.background = '';
				}
				
				container.style.backgroundColor = (invert) ? 'black' : 'white';
			});
			
			mxEvent.disableContextMenu(container);
   return this;
		};
  
  main.prototype.connect = function (name,source,destination, staticPoints) {
     var graph = this.graph;
     var parent = this.graph.getDefaultParent();

     var e1 = graph.insertEdge(parent, null, name, source, destination,'entryX=0;entryY=0.5;entryPerimeter=0;');
     e1.geometry.points = staticPoints;
     return e1;
  } 
  
  main.prototype.connection = function (name,source,destination, sourcePoint, destinationPoint) {
     var graph = this.graph;
     var parent = this.graph.getDefaultParent();
     var e1 = graph.insertEdge(parent, null, name, source, destination);
     e1.geometry.setTerminalPoint (sourcePoint, true);
     e1.geometry.setTerminalPoint (destinationPoint, false);
     return e1;
  } 
  
  main.prototype.createJ3 = function (name,x,y) { 
     var graph = this.graph;
     var parent = this.graph.getDefaultParent();
         
     graph.getModel().beginUpdate();
         
     var v1 = graph.insertVertex(parent, null, name, x, y, 40, 80,
       'verticalLabelPosition=top;verticalAlign=bottom;shadow=1;fillColor=' + fillColor);
     v1.setConnectable(false);

     var v11 = graph.insertVertex(v1, null, '1', 0, 0, 10, 16,
       'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;'+
       'spacingLeft=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor);
     v11.geometry.relative = true;
     v11.geometry.offset = new mxPoint(-v11.geometry.width, 2);
     var v12 = v11.clone();
     v12.value = '2';
     v12.geometry.offset = new mxPoint(-v11.geometry.width, 22);
     v1.insert(v12);
     var v13 = v11.clone();
     v13.value = '3';
     v13.geometry.offset = new mxPoint(-v11.geometry.width, 42);
     v1.insert(v13);
     var v14 = v11.clone();
     v14.value = '4';
     v14.geometry.offset = new mxPoint(-v11.geometry.width, 62);
     v1.insert(v14);
    
					var v15 = v11.clone();
					v15.value = '5';
					v15.geometry.x = 1;
					v15.style =	'shape=line;align=right;verticalAlign=middle;fontSize=10;routingCenterX=0.5;'+
						'spacingRight=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor;
					v15.geometry.offset = new mxPoint(0, 2);
					v1.insert(v15);
					
					var v16 = v15.clone();
					v16.value = '6';
					v16.geometry.offset = new mxPoint(0, 22);
					v1.insert(v16);
					var v17 = v15.clone();
					v17.value = '7';
					v17.geometry.offset = new mxPoint(0, 42);
					v1.insert(v17);
					var v18 = v15.clone();
					v18.value = '8';
					v18.geometry.offset = new mxPoint(0, 62);
					v1.insert(v18);
					
					var v19 = v15.clone();
					v19.value = 'clk';
					v19.geometry.x = 0.5;
					v19.geometry.y = 1;
					v19.geometry.width = 10;
					v19.geometry.height = 4;
					// NOTE: portConstraint is defined for east direction, so must be inverted here
					v19.style = 'shape=triangle;direction=north;spacingBottom=12;align=center;portConstraint=horizontal;'+
						'fontSize=8;strokeColor=' + strokeColor + ';routingCenterY=0.5;';
					v19.geometry.offset = new mxPoint(-4, -4);
					v1.insert(v19);     
					graph.getModel().endUpdate();                
					return v1;
  } 
     
  main.prototype.createResistor = function (name, x, y, leftName, rightName ) { 
					var graph = this.graph;
					var parent = graph.getDefaultParent();
					
					var v2 = graph.insertVertex(parent, null, 'R1', x, y, 80, 20,
							'shape=resistor;verticalLabelPosition=top;verticalAlign=bottom;');				
					// Uses implementation of connection points via constraints (see above)
					v2.setConnectable(false);    
					
					var v21 = graph.insertVertex(v2, null, leftName, 0, 0.5, 10, 1,
						'shape=none;spacingBottom=11;spacingLeft=1;align=left;fontSize=8;'+
						'fontColor=#4c4c4c;strokeColor=#909090;');
					v21.geometry.relative = true;
					v21.geometry.offset = new mxPoint(-10, -1);
				
					var v22 = graph.insertVertex(v2, null, rightName, 1, 0.5, 10, 1,
						'spacingBottom=11;spacingLeft=1;align=left;fontSize=8;'+
						'fontColor=#4c4c4c;strokeColor=#909090;');
					v22.geometry.relative = true;
					v22.geometry.offset = new mxPoint(-10, -1);
											
					return v2;
  } 
     
		main.prototype.addPin = function (container, name, leftSide, offsetX, offsetY) {
					var graph = this.graph;
					var vertexWidth = 10;
					var vertexHeight = 16; 
					var v11;
					var alignment = (leftSide) ? 'left' : 'right'; 
					var spacing   = (leftSide) ? 'Left' : 'Right'; 
     v11 = graph.insertVertex(container, null, name, 0, 0, vertexWidth, vertexHeight,
       'shape=line;align=' + alignment + ';verticalAlign=middle;fontSize=10;routingCenterX=-0.5;'+
							'spacing' + spacing + '=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor);
					v11.geometry.relative = true;
					v11.geometry.offset = new mxPoint(offsetX, offsetY);
					return v11;
		} 

  main.prototype.createMagnetekReceiver = function (name,x,y) { 
					var graph = this.graph;
					var parent = graph.getDefaultParent();
					
					var width  = 50;
					var height = 100;
					
					graph.getModel().beginUpdate(); 					
					var v0 = graph.insertVertex(parent, null, name, x, y, width, height,
						'verticalLabelPosition=top;verticalAlign=bottom;shadow=1;fillColor=' + fillColor);        
												
     var offsetX   = -10;
					var leftPins  = ['7', '8', '9', '10', '11', '12'];
					var rightPins = ['6', '5', '4', '3',  '2',  '1'];
			
     var offsetY = 2;			
					for (pin in leftPins) {
   					this.addPin (v0, leftPins[pin], true, offsetX,  offsetY);
        offsetY = offsetY + 15;								 
					} 
  
     offsetX = 50
     var offsetY = 2;			
					for (pin in rightPins) {
   					this.addPin (v0, rightPins[pin], false, offsetX,  offsetY);
        offsetY = offsetY + 15;								 
					} 
     
					graph.getModel().endUpdate(); 
					return v0;		
		}
					
  main.prototype.createNano = function (name,x,y) { 
					var graph = this.graph;
					var parent = graph.getDefaultParent();
					graph.getModel().beginUpdate();     
					var width  = 70;
					var height = 230;
					
					var v1 = graph.insertVertex(parent, null, name, x, y, width, height,
						'verticalLabelPosition=top;verticalAlign=bottom;shadow=1;fillColor=' + fillColor);        
					
     var offsetX = -10;
					var leftPins  = ['D13', '3V3', 'REF', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', '5V',  'RST', 'GND', 'VIN'];
					var rightPins = ['D12', 'D11', 'D10', 'D9', 'D8', 'D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'GND', 'RST', 'RX0', 'TX1'];
			
     var offsetY = 2;			
					for (pin in leftPins) {
   					this.addPin (v1, leftPins[pin], true, offsetX,  offsetY);
        offsetY = offsetY + 15;														   
					} 
					
     var offsetY = 2;			
					var offsetX = 70;
					for (pin in rightPins) {
   					this.addPin (v1, rightPins[pin], false, offsetX,  offsetY);
        offsetY = offsetY + 15;								
						   
					} 
					
					graph.getModel().endUpdate();
					return v1;
  } 
     
		main.prototype.removeElements = function () {
				this.graph.getModel().beginUpdate();     
				this.graph.selectAll (this.graph.getDefaultParent());				
				this.graph.removeCells (this.graph.getSelectionCells() );
				this.graph.getModel().endUpdate(); 					
				this.items = []
		} 			
		
		main.prototype.findObject = function ( name ) {
			  var obj;
					var found = false;
			  for (item in this.items) {
					   obj = this.items[item];
								if (obj.name == name ) {									   
								   found = true;
											console.log ( 'Found ' + name );
									  break;
								} 
					} 
					if (!found) { 
					   console.log  ( 'Could not find: ' + name );
								obj = undefined;
					} else {
						  obj = obj.obj;
					} 
					return obj;
		} 
					
		main.prototype.createConnection = function (name, sourceName, sourceIndex, endName, endIndex) { 
		  var sourceObject = this.findObject ( sourceName );
				var endObject = this.findObject (endName);
				console.log ( 'createConnection (' + name + ',' + sourceName + ',' + sourceIndex + ',' + endName + ',' + endIndex + ')' );
		  var e1 = this.connect ( name, sourceObject.getChildAt(sourceIndex), endObject.getChildAt(endIndex)); 
				return e1;
		} 		
					
  main.prototype.createSolidState = function (name,x,y) {
					var graph = this.graph;
					var parent = graph.getDefaultParent();
					
					graph.getModel().beginUpdate();     
					var width  = 70;
					var height = 80;
					var vertexWidth = 10;
					var vertexHeight = 16; 
					
					
					var v1 = graph.insertVertex(parent, null, name, x, y, width, height, 
						'verticalLabelPosition=top;verticalAlign=bottom;shadow=1;fillColor=' + fillColor);
					
					v1.setConnectable(false);
					var v11 = graph.insertVertex(v1, null, '1\nOut', 0, 0, vertexWidth, vertexHeight,
							'shape=line;align=left;verticalAlign=middle;fontSize=10;routingCenterX=-0.5;'+
							'spacingLeft=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor);
					v11.geometry.relative = true;
					v11.geometry.offset = new mxPoint(-v11.geometry.width, 2);

					var v12 = v11.clone();
					v12.value = '4\nGND';
					v12.geometry.offset = new mxPoint(-v11.geometry.width, 42);
					v1.insert(v12);
					
					var v15 = v11.clone();
					v15.value = '2\nPower';
					v15.geometry.x = 1;
					v15.style =	'shape=line;align=right;verticalAlign=middle;fontSize=10;routingCenterX=0.5;'+
						'spacingRight=12;fontColor=' + fontColor + ';strokeColor=' + strokeColor;
					v15.geometry.offset = new mxPoint(0, 2);
					v1.insert(v15);  

					var v16 = v15.clone();
					v16.value = '3\nPWM';
					v16.geometry.offset = new mxPoint (0, 42);
					v1.insert (v16);
													
					graph.getModel().endUpdate();
					return v1;
  }
		
		main.prototype.createSymbol = function (type, name, x, y, sourceName, sourceIndex, endName, endIndex) { 		
		  var obj;
    switch (type) {
       case 'solidStateRelay': 
          console.log ( 'Add a solid state relay location [' + x + ',' + y + ']' );
          obj = this.createSolidState (name,x,y);
										this.items.push ( {"obj":obj, "type":type, "name":name, "x":x, "y":y } ); 
          break;
       case 'j3': 
          console.log ( 'Add a j3 to location [' + x + ',' + y + ']' );
          obj = this.createJ3(name, x,y);
										this.items.push ( {"obj":obj, "type":type, "name":name, "x":x, "y":y } ); 
          break;
							case 'nanoPinout': 
							   console.log ( 'Add a nano at [' + x + ',' + y + ']' );
										obj = this.createNano (name,x,y);
										this.items.push ( {"obj":obj, "type":type, "name":name, "x":x, "y":y } ); 
										break;
							case 'magnetekReceiver':
							   console.log ( 'Add a Magnetek Receiver' );
										obj = this.createMagnetekReceiver (name,x,y);
										this.items.push ( {"obj":obj, "type":type, "name":name, "x":x, "y":y } ); 
										break;
							case 'connection': 
							   console.log ( 'Add a connection' );
										obj = this.createConnection (name, sourceName, sourceIndex, endName, endIndex );
										this.items.push ( {"obj":obj, "type":type, "name":name, "x":x, "y":y, "sourceName":sourceName, "sourceIndex":sourceIndex, "endName":endName, "endIndex":endIndex } ); 
       default:
          console.log ( 'Could not add: ' + name );
          break;
    } 
 } 