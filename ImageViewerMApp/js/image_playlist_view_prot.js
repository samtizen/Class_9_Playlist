var ImagePlaylistView = (function() {
	
	function ImagePlaylistView(){
		
	}
	
	ImagePlaylistView.prototype = {
			
		//Добавление нового файла
		add : function(fileObj) {
						
			var htmlCode = '<div class="ui-playlist-item" id="playlist_' + fileObj.id + '">' +
				'<img class="ui-gridview-image" src="' + fileObj.contentURI + '">' +
				'<label class="ui-playlist-checkbox-item">' +
					'<input type="checkbox" id="playlistChekbox_' + fileObj.id + '" class="ui-checkbox ui-playlist-checkbox" data-tau-built="Checkbox" data-tau-name="Checkbox" aria-disabled="false" data-tau-bound="Checkbox">' +
				'</label>' +
			'</div>';
				
			
			$("#image-viewer-playlist").append(htmlCode);
			
			console.log("ImagePlaylistView: add");

		},
		//Добавление нескольких файла
		addList : function(fileObjs) {
			
			console.log("ImagePlaylistView: addList");
			
			console.log(fileObjs);
			
			var i=0, 
				lenList = fileObjs.length,
				htmlCode = "";
				
			for(i; i < lenList; i++) {
				
				
				htmlCode += '<div class="ui-playlist-item" id="playlist_' + fileObjs[i].content.id + '">' +
					'<img class="ui-gridview-image" src="' + fileObjs[i].content.contentURI + '">' +
					'<label class="ui-playlist-checkbox-item">' +
						'<input type="checkbox" id="playlistChekbox_' + fileObjs[i].content.id + '" class="ui-checkbox ui-playlist-checkbox" data-tau-built="Checkbox" data-tau-name="Checkbox" aria-disabled="false" data-tau-bound="Checkbox">' +
					'</label>' +
				'</div>';
				
			}

			$("#image-viewer-playlist").append(htmlCode);
			
		},
		//Изменение файла
		update : function(itemObj) {
			
			
		},
		//Удаление файла
		remove : function() {

			
		},
		//Удаление нескольких файлов
		removeList : function(items) {
			
			var i=0, 
			lenList = items.length;
			
			for(i; i < lenList; i++) {
			
				$("#playlist_" + items[i].content.id).remove();
				
				console.log("#playlist_" + items[i].content.id);
				console.log("Item View "+ items[i].content.contentURI +" was Removed");
			}
			
			
		},
		//Удаление нескольких файлов
		removeAndAddList : function(fileObjs) {
			
			$("#image-viewer-playlist").html("");

			this.addList(fileObjs);
			
		}
	}
	
	return ImagePlaylistView;
})();