var ImageContentView = (function() {
	
	function ImageContentView(){
		
	}
	
	ImageContentView.prototype = {
			
		//Добавление нового файла
		add : function() {
				
		},
		//Добавление нескольких файла
		addList : function(fileObjs) {
				
			console.log("ImageContentView: addList");
			
			console.log(fileObjs);
			
			var i=0, 
				lenList = fileObjs.length,
				htmlCode = "";
				
			for(i; i < lenList; i++) {
				
				
				htmlCode += '<div class="ui-content-item">' +
					'<img class="ui-gridview-image" src="' + fileObjs[i].contentURI + '">' +
					'<label class="ui-content-checkbox-item">' +
						'<input type="checkbox" id="content_' + fileObjs[i].id + '" class="ui-checkbox ui-content-checkbox" data-tau-built="Checkbox" data-tau-name="Checkbox" aria-disabled="false" data-tau-bound="Checkbox">' +
					'</label>' +
				'</div>';
				
			}

			$("#image-viewer-content-list").append(htmlCode);
			
			
		},
		//Изменение файла
		update : function(fileObj) {

		},
		//Удаление файла
		remove : function(fileName) {
			
		},
		//Удаление нескольких файлов
		removeList : function() {

		},
		//Удаление нескольких файлов
		removeAndAddList : function(fileObjs) {
			
			$("#image-viewer-content-list").html("");

			this.addList(fileObjs);
			
		}
	}
	
	return ImageContentView;
})();