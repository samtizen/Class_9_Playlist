/*
 * File: image_content_prot.js
 * Application: Image Manager
 * Author: Sergei Papulin
 */

var ImageContent = (function() {
	
	function ImageContent() {
		
		//this.imageContents;
		this.mapImageContents = {};
		
	}
	
	ImageContent.prototype = {
		
		init : function(callbackContentView){
			
			var sortMode = new tizen.SortMode("name", "ASC"),
				filter = new tizen.AttributeFilter("type", "EXACTLY", "IMAGE");
			
			var self = this;
			
			tizen.content.find(onsuccessFind, onerrorFind, null, filter, sortMode);
			
			function onsuccessFind(fileContents)
			{
				//self.imageContents = fileContents;
				
				var i=0, 
					lenList = fileContents.length;
				
				for (i; i < lenList; i++) {
					
					self.mapImageContents[fileContents[i].id] = fileContents[i];
					//console.log(fileContents[i].contentURI);
				}
				
				if (callbackContentView != null) {
					callbackContentView(fileContents);
				}
			}
			
			function onerrorFind(e) {
				
				console.log(e);
				
			}
			
		},
			
		scanFile : function(fileObj) {
			
			tizen.content.scanFile(fileObj.toURI(), onsuccessScanFile);
			
			function onsuccessScanFile(data) {
				
				console.log(data);
			
			}
			
		},
		
		scanFileByURI : function(fileURI, callback) {
			
			tizen.content.scanFile(fileURI, onsuccessScanFile);
			
			function onsuccessScanFile(data) {
				
				console.log("ImageContent: scanFileByURI -> onsuccessScanFile");
				
				callback();
			
			}
			
			function onerrorScanFile(e) {
				
				console.log(e);
				
			}
			
		},
		scanDirectory : function(dirObj) {
			
			tizen.content.scanDirectory(dirObj.toURI(), true, onsuccessScan);
			//tizen.content.scanDirectory("/opt/usr/media/Documents/", true, onsuccessScan);
			
			function onsuccessScan() {
				
				console.log("OK");
				
			}
			
		},
		
		createContent : function(fileURI, fileUserContent, callbackPlaylist, callbackPlaylistView) {
			
			var uriFilter = new tizen.AttributeFilter("contentURI", "EXACTLY", "file://" + fileURI);
			
			
			this.scanFileByURI(fileURI, function() {
				
				tizen.content.find(onsuccessFind, onerrorFind, null, uriFilter, null);
				
				function onsuccessFind(fileContents)
				{
					if (fileContents.length === 1) {
							
						console.log(fileContents[0]);
						
						fileContents[0].description = fileUserContent.description;
						fileContents[0].geolocation.latitude = fileUserContent.latitude;
						fileContents[0].geolocation.longitude = fileUserContent.longitude;
						fileContents[0].album = fileUserContent.location;
						
						console.log("ImageContent: createContent -> OK")
						
						callbackPlaylist(fileContents[0], callbackPlaylistView);
						
					}
					
				}			
				
				function onerrorFind(e) {
					
					console.log(e);
					
				}
			});
				
		},
		
		updateContent : function(fileURI, fileUserContent) {
			
			var uriFilter = new tizen.AttributeFilter("contentURI", "EXACTLY", "file://" + fileURI);
			
			
			this.scanFileByURI(fileURI, function() {
				
				tizen.content.find(onsuccessFind, onerrorFind, null, uriFilter, null);
				
				function onsuccessFind(fileContents)
				{
					if (fileContents.length === 1) {
							
						console.log(fileContents[0]);
						
						fileContents[0].description = fileUserContent.description;
						fileContents[0].geolocation.latitude = fileUserContent.latitude;
						fileContents[0].geolocation.longitude = fileUserContent.longitude;
						fileContents[0].album = fileUserContent.location;
						
						console.log(fileContents[0].description);
						console.log(fileContents[0].album);
						
					}
					
				}			
				
				function onerrorFind(e) {
					
					console.log(e);
					
				}
			});
				
		},
		
		getContenList : function(contentIds) {
			
			var contentList = [];
				
			var i=0, 
			lenList = contentIds.length;
			
			for(i; i < lenList; i++) {
				
				if (contentIds[i] in this.mapImageContents) {
					
					contentList.push(this.mapImageContents[contentIds[i]]);
					
				}
				
			}
			//console.log("ImageContent: getContenList -> successully implemented");
			//console.log(contentList);
			
			return contentList;
			
		},
		filter : function(callbackFile, callbackView) {
			
			var sortMode = new tizen.SortMode("name", "ASC");
			
			var filter = new tizen.AttributeFilter("type", "EXACTLY", "IMAGE");
			
			tizen.content.find(onsuccessFind, onerrorFind, null, filter, sortMode);
			
			function onsuccessFind(fileContents)
			{
				//console.log("FileContent: filter");
				//console.log(fileContents);
				
				for (var i=0; i < fileContents.length; i++) {
					console.log(fileContents[i].contentURI);
				}
				
				tizen.content.createPlaylist("My new playlist", onsuccessCreate, onerrorCreate);
				
				function onsuccessCreate(playlist) {
					
					//console.log(playlist);
					//console.log(playlist.id);
					
				}
				
				function onerrorCreate(e) {
					
					console.log(e);
					
				}
				
			}
			
			function onerrorFind(e) {
				
				console.log(e);
				
			}
			
		},
		
		filter2 : function(callbackPlaylist, callbackContentView) {
			
			var sortMode = new tizen.SortMode("name", "ASC");
			
			var filter = new tizen.AttributeFilter("type", "EXACTLY", "IMAGE");
			
			tizen.content.find(onsuccessFind, onerrorFind, null, filter, sortMode);
			
			function onsuccessFind(fileContents)
			{
				console.log("ImageContent: filter2");
				console.log(fileContents);
				
				if (callbackPlaylist != null) {
					callbackPlaylist([fileContents[0], fileContents[1]]);
				}
				
				if (callbackContentView != null) {
					callbackContentView(fileContents);
				}
			}
			
			function onerrorFind(e) {
				
				console.log(e);
				
			}
			
		}
	};
	
	return ImageContent;
	
})();