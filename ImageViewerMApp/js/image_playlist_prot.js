var ImagePlaylist = (function(){
	
	function ImagePlaylist(plName, callbackView) {
		
		this.playlist = null;
		this.init(plName, callbackView);
		
		this.imageIds = {};
		
	}
	
	ImagePlaylist.prototype = {
			
		init: function(playlistName, callbackView){
				
				var self = this;
				
				tizen.content.createPlaylist(playlistName, onsuccessCreate, onerrorCreate);
				
				function onsuccessCreate(playlist) {
					
					self.playlist = playlist;
					
					console.log("ImageContent: init -> create new playlist");
				
					console.log(playlist);
					console.log(playlist.id);
				
				}
			
				function onerrorCreate(e) {
					
					if (e.code === 0) {
						
						tizen.content.getPlaylists(onsuccessGetPlaylist);
						
						function onsuccessGetPlaylist(playlists) {
							
							var i = 0,
								lenList = playlists.length;
							
							for (i; i < lenList; i++) {
								
								if (playlists[i].name === playlistName) {

									self.playlist = playlists[i];
									
									self.getList(callbackView);
									
									console.log("ImageContent: init -> playlist exists");
									console.log(self.playlist);
									console.log(self.playlist.id);
									
									break;
									
								}	
							}	
						}
					}
					console.log(e);
				}
		},
		
		addItem : function(imageContent, callbackView) {
			
			console.log("ImagePlaylist: addItem");		
			
			var self = this;
			
			if (this.playlist != null) {
				
				if (!(imageContent.id in self.imageIds)) {
					
					this.playlist.add(imageContent);
				
					self.imageIds[imageContent.id] = imageContent;
						
					console.log("ImagePlaylist: addItem -> OK");
						
					callbackView(imageContent);
						
				}	
			}
		
		},
		
		addUniqueList : function(imageContents, callbackView) {
		
			console.log("ImagePlaylist: addUniqueList");
			
			if (this.playlist != null) {
				
				var i = 0,
					lenList = imageContents.length;
				
				var uniqContentList = [];
				
				
				for (i; i < lenList; i++) {
					
					if (!(imageContents[i].id in this.imageIds)) {
						
						uniqContentList.push(imageContents[i]);
						
					}
					
				}
				
				console.log(this);
				
				console.log("Unique Images:");
				console.log(uniqContentList);
				
				this.addList(uniqContentList, callbackView);
			}
			
		},
		
		addList : function(imageContents, callbackView) {
			
			console.log("ImagePlaylist: addList");
			
			var self = this;
			
			if (this.playlist != null) {
				
				this.playlist.addBatch(imageContents, onsuccessAddBatch, onerrorAddBatch);
				
				function onsuccessAddBatch() {
					
					console.log("ImagePlaylist: addList -> successully implemented");
					
					self.getList(callbackView);
					
				}
				
				function onerrorAddBatch() {
					
					console.log("ImagePlaylist: addList -> failed");
					
				}
				
			}
			
		},
		
		getList : function(callback) {
			
			if (this.playlist != null) {
				
				var self = this;
			
				this.playlist.get(onsuccessGet);
				
				function onsuccessGet(items) {
					
					console.log(items);
					
					for (var i=0; i < items.length; i++) {
						
						self.imageIds[items[i].content.id] = items[i].content.contentURI;
						
						console.log(items[i].content.id);
					}
					
					//console.log(callback);
					
					if (callback != null) {
						
						callback(items);
					
					}
					
				}
			}
			
		},
		
		getListByIds : function(itemIds, callback, callbackView) {
			
			if (this.playlist != null) {
			
				this.playlist.get(onsuccessGet);
				
				function onsuccessGet(items) {
					
					console.log(items);
					
					var itemContents = [];
					
					for (var i=0; i < items.length; i++) {
						
						if (itemIds.indexOf(items[i].content.id) !== -1) {
							
							itemContents.push(items[i]);
							
							console.log("ImagePlaylist: getListByIds -> found");
							//console.log(items[i].content.id);
						}
						
						//console.log(items[i].content.contentURI);
					}
					
					//console.log(itemContents);
					
					if (callback != null) {
						
						callback(itemContents, callbackView);
						
					}
					
				}
			}
			
		},
		
		removeList : function(itemList, callbackView) {
			
			console.log("ImagePlaylist: removeList");
			
			console.log(itemList);
			
			if (this.playlist != null) {
				
				this.playlist.removeBatch(itemList, onsuccessRemoveBatch, onerrorRemoveBatch);
				
				var self = this;
				
				function onsuccessRemoveBatch() {
					
					console.log("ImagePlaylist: removeList");
					
					var i = 0,
					lenList = itemList.length;

					for (i; i < lenList; i++) {
					
						delete self.imageIds[itemList[i].content.id];
						
					}
					
					callbackView(itemList);
					
					console.log("ImagePlaylist: removeList -> successully implemented");
					
				}
				
				function onerrorRemoveBatch() {
					
					console.log("ImagePlaylist: removeList -> failed");
					
				}
				
			}
			
		},
		
		removeItemById : function(itemId) {
			
			
			
		},
		
		removeListByIds : function(itemIds, callbackView) {
			
			var self = this;
			
			//ВНИМАНИЕ! НЕ ИСПОЛЬЗУЙТЕ: this.getListByIds(itemIds, this.removeList);
			this.getListByIds(itemIds, function(itemList) {
				
				self.removeList(itemList, callbackView);
				
			});

			
		},
		
		sort : function() {
			
		}
		
	}
	
	return ImagePlaylist;
})();