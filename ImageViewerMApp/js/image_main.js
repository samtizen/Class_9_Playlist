/*
 * File: image_main.js
 * Application: Image Manager
 * Author: Sergei Papulin
 * 
 * ContentManager:
 * https://developer.tizen.org/ko/development/guides/web-application/data-storage-and-management/stored-content-management?langredirect=1
 * https://developer.tizen.org/ko/development/api-references/web-application?redirect=/dev-guide/latest/org.tizen.web.apireference/html/device_api/mobile/tizen/content.html&langredirect=1
 * 
 * AppControl:
 * https://developer.tizen.org/ko/development/api-guides/web-application/tizen-features/application-framework/application?langredirect=1
 * https://developer.tizen.org/ko/development/api-references/web-application?redirect=/dev-guide/2.4/org.tizen.web.apireference/html/device_api/mobile/tizen/application.html&langredirect=1#ApplicationControl
 * https://https://developer.tizen.org/ko/development/guides/web-application/tizen-features/application/application/common-application-controls?langredirect=1
 * 
 * Geolocation:
 * https://developer.tizen.org/ko/development/tutorials/web-application/w3chtml5supplementary-features/location/geolocation-api-specification?langredirect=1
 * 
 * Google Geocode API:
 * https://developers.google.com/maps/documentation/geocoding/intro
 * 
 * Icons: 
 * http://www.flaticon.com/
 * 
 */

(function() {
	
	var imageMain = {},
		imagePlaylistView,
		imageContentView,
		imageContent,
		imagePlaylist;
	
	
	imageMain.init = function() {
		
		console.log("Init Function");
		
		imagePlaylistView = new ImagePlaylistView();
		imageContentView = new ImageContentView();
		imageContent = new ImageContent();
		imagePlaylist = new ImagePlaylist("imageViewer", imagePlaylistView.addList);
		
		//Page 1: Основная страница со списком элементов playlist - image-viewer-main
		$("#image-viewer-main").on("pagebeforeshow", function() {
			
			$("#image-viewer-contents").css("display", "none");
			$("#image-viewer-add-image-page").css("display", "none");
			$(this).css("display", "block");
			
			//imagePlaylist.getList(imagePlaylistView.addList);
			
		});
		$("#btn-delete-playlist-items").click(deletePlaylistItems);
		$("#btn-show-image-viewer-add-page").click(showImageContentPage);
		$("#btn-show-camera-app").click(launchCameraApp);
		
		
		//Page 2: Страница со списком файлов с типом IMAGE - image-viewer-contents
		$("#image-viewer-contents").on("pagebeforeshow", showImageViewerContents);
		$("#btn-back-to-image-viewer-main").click(backToImageViewerMain);
		$("#btn-add-images-to-playlist").click(addImagesToPlaylist);
		
		
		//Page 3: Страница добавления описаний - image-viewer-add-image-page
		$("#image-viewer-add-image-page").on("pagebeforeshow", showAddImagePlaylistPage);
		$("#btn-add-image-to-playlist").click(addImageToPlaylist);
		$("#btn-location-add").click(addLocationName);
		$("#btn-back-to-image-viewer-main-from-add-image-page").click(backToMainFromAddImagePage);
		
		//Page 0: 
		/*$("#btn-get-filter").click(getFilter);
		$("#btn-create-playlist").click(createPlaylist);
		$("#btn-get-content-list").click(getContentItems);
		$("#btn-get-image-list").click(getPlaylistItems);
		$("#btn-add-image-list").click(addImagesToPlaylist);
		$("#btn-remove-image-list").click(removeImagesFromPlaylist);
		*/
		
	};
	
	function backToMainFromAddImagePage() {
		
		tau.changePage("image-viewer-main", {transition: "pop", reverse: false});
		
	}
	
	function addLocationName() {
		
		if ($("#btn-location-add").prop("checked")) {
			
			var latlon = $("#lbl-add-image-page-lat").text() + "," + $("#lbl-add-image-page-lon").text();
			
			console.log(latlon);
			
			var reqData = {
			    "latlng": latlon,
			    "key": "AIzaSyDxiN176dXOi1Gmrr46Uf3PVBKgnNrCFxs"
			};
			
			$.ajax({
				  
				type: "GET",
				url: "https://maps.googleapis.com/maps/api/geocode/json",
				dataType: "JSON",
				data: reqData,
				success: onsuccessAjaxAddress,
				error: onerrorAjaxAddress
				  
			});
			
			function onsuccessAjaxAddress(address) {
				
				$("#txt-location-name-add").val(address.results[0].formatted_address);
				console.log(address);
				
				
			}
			
			function onerrorAjaxAddress(e) {
				
				console.log(e);
				
			}
			
			$("#div-location-add").show();
			
		}
		else {
			
			$("#div-location-add").hide();
			
		}
		
		
	}
	function showAddImagePlaylistPage() {
				
		$("#image-viewer-contents").css("display", "none");
		$("#image-viewer-main").css("display", "none");
		$(this).css("display", "block");
		
		
		navigator.geolocation.getCurrentPosition(onsuccessGetPosition, onerrorGetPosition, {maximumAge: 60000});
		
		function onsuccessGetPosition(position) {
			console.log(position);
			$("#lbl-add-image-page-lat").text(position.coords.latitude);
			$("#lbl-add-image-page-lon").text(position.coords.longitude);
			
		}
		
		function onerrorGetPosition(e) {
			
			console.log(e);
			
		}
		
	}
	
	function launchCameraApp() {
			
		var appControl = new tizen.ApplicationControl("http://tizen.org/appcontrol/operation/create_content",
                null, "image/*", null, null, null);

		
		var appControlReplyCallback =
		{
			onsuccess: function(data) {   
				
				var i = 0,
					lenList = data.length;
				
				for (i; i < lenList; i++)
				{
					if (data[i].key === "http://tizen.org/appcontrol/data/selected") {
						
						//imageContent.scanFileByURI(data[i].value[0]);
						
						showAddImageFromCamera(data[i].value[0]);
						
						tau.changePage("image-viewer-add-image-page", {transition: "pop", reverse: false});
				
					}

				}
		   	},
			onfailure: function(e) {
				console.log(e);
			}
		}
		
		
		tizen.application.launchAppControl(appControl, null, oncussessLaunch, onerrorLaunch, appControlReplyCallback);
		
		function oncussessLaunch() {
			
			console.log("Camera was launched successfully");
			
		}
		
		function onerrorLaunch(e) {
			
			console.log(e);
			
		}
		
	}
	
	function showAddImageFromCamera(imageURI) {
		
		$("#img-add-page").attr("src", imageURI);
		
	}
	
	function showImageViewerContents() {
		
		imageContent.init(imageContentView.removeAndAddList.bind(imageContentView));
		
		$("#image-viewer-main").css("display", "none");
		$("#image-viewer-add-image-page").css("display", "none");
		$(this).css("display", "block");
		
		
		
	}
	function showImageContentPage() {
		
		tau.changePage("image-viewer-contents", {transition: "pop", reverse: false});
	}
	
	function backToImageViewerMain() {
		
		tau.changePage("image-viewer-main", {transition: "pop", reverse: false});
		
	}
	
	function addImageToPlaylist() {
			
		var fileUserContent = {
				fileURI : "",
				description : "",
				latitude : "",
				longitude : "",
				location : ""
		};
		
		fileUserContent.fileURI = $("#img-add-page").attr("src");
		fileUserContent.description = $("#txt-descr-add-page").val();
		fileUserContent.latitude = $("#lbl-add-image-page-lat").val();
		fileUserContent.longitude = $("#lbl-add-image-page-lon").val();
		
		if ($("#btn-location-add").prop("checked")) {
			fileUserContent.location =  $("#txt-location-name-add").val();
		}
		
		imageContent.createContent(
				fileUserContent.fileURI, 
				fileUserContent, 
				imagePlaylist.addItem.bind(imagePlaylist), 
				imagePlaylistView.add.bind(imagePlaylistView));
		
		tau.changePage("image-viewer-main", {transition: "pop", reverse: false});
		
	}
	
	function addImagesToPlaylist() {
		
		var checkedList = [];
		
		$(".ui-content-checkbox:checkbox:checked").each(function(){
			
			console.log(this.id);
			
			checkedList.push(this.id.split("_")[1]);
				
		});
		
		//console.log(checkedList);
		
		var contentList = imageContent.getContenList(checkedList);
		
		console.log("List of selected images:")
		console.log(contentList);
		
		imagePlaylist.addUniqueList(contentList, imagePlaylistView.removeAndAddList.bind(imagePlaylistView));
		
		tau.changePage("image-viewer-main", {transition: "pop", reverse: false});
		
	}
	
	function deletePlaylistItems() {
		
		var checkedList = [];
		
		$(".ui-playlist-checkbox:checkbox:checked").each(function(){
			
			console.log(this.id);
			
			checkedList.push(this.id.split("_")[1]);
				
		});
		
		imagePlaylist.removeListByIds(checkedList, imagePlaylistView.removeList);
		
	}
	
	/*
	function getFilter() {
		
		imageContent.init();
		
	}
	
	function createPlaylist() {
		
		imagePlaylist = new ImagePlaylist("imageViewer");
		
	}
	
	function getContentItems() {
		
		imageContent.filter2(null, imageContentView.addList);
		
	}
	
	function getPlaylistItems() {
		
		imagePlaylist.getList(imagePlaylistView.addList);
		
		
	}
	
	function addImagesToPlaylist() {
		
		imageContent.filter2(imagePlaylist.addList.bind(imagePlaylist));
		
	}
	
	function removeImagesFromPlaylist() {
		
		var myList = ["0ceb1f3d-eafe-48e0-b850-48b65d463641"];
		
		imagePlaylist.removeListByIds(myList);
		
	}*/
	
	return imageMain;
	
})().init();