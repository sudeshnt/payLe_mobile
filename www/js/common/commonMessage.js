angular.module('starter').controller('CommonMessageController', function ($scope,$state,$stateParams) {
  $scope.title = $stateParams.title;
  $scope.message = $stateParams.message;
  $scope.backNavigation = $stateParams.backNavigation;
});
angular.module('starter').controller('galleryController', function ($scope,$state,$stateParams, $ionicBackdrop, $ionicModal, $ionicSlideBoxDelegate, $ionicScrollDelegate,$ionicLoading,$ionicPopup,serviceLocator,httpService,$filter, $cordovaCamera,$cordovaFileTransfer) {

  $scope.title = $filter('translate')('GALLERY');

  $scope.merchantCode = $stateParams.merchantCode;
  $scope.accessType = $stateParams.type;
  $scope.zoomMin = 1;
  // console.log($scope.merchantCode);
  if($scope.merchantCode==null || $scope.merchantCode==''){
    $state.go('home');
  }
  //set back navigation
  switch ($scope.accessType) {
    case 'merchant':
      $scope.backNavigation = 'merchantHome';
      break;
    case 'customer':
      $scope.backNavigation = 'merchantHome';
      break;
    default:
      break;
  }

  initGallery();

  function initGallery(){
    $scope.galleryColumns = {
      column_0:[],
      column_1:[],
      column_2:[]
    };
    $scope.allImages = [];
    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/getImageGalleryByMerchant/'+$scope.merchantCode;
    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      // console.log(response);
      var idImageService = serviceLocator.serviceList.IDImage;
      var extended_url = '/GalleryImageView?image=';
      var uri = encodeURI(idImageService.serviceUrl+':'+idImageService.port+idImageService.base_url+extended_url);
      for(var i=0 ; i < response.imageUrlList.length ; i++){
        $scope.allImages.push({
           src: uri+response.imageUrlList[i]
        });
        $scope.galleryColumns['column_'+i%3].push({
          src: uri+response.imageUrlList[i],
          index:i
        });
      }
    });
  }

  $scope.uploadCLicked = function () {
    $scope.frontUploadClicked = true;
  };

  $scope.takePicture = function(sourceType) {
    var source = null;
    switch (sourceType) {
      case 'gallery':
        source = Camera.PictureSourceType.PHOTOLIBRARY ;
        break;
      case 'camera':
        source = Camera.PictureSourceType.CAMERA;
        break;
      default:
        break;
    }
    var options = {
      quality : 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: source,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 640,
      targetHeight: 1024,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: true
    };
    $cordovaCamera.getPicture(options).then(function(imageData) {
      $cordovaCamera.cleanup();
      $scope.uploadProgress = 0;
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br><span>Uploading... '+$scope.uploadProgress+'%</span><br><progress style="height: 6px;" max="100" value="'+$scope.uploadProgress+'"> </progress>',
        hideOnStateChange: true
      });
      uploadImage(imageData)
    }, function(err) {
      // An error occured. Show a message to the user
    });
  };

  function uploadImage(fileURL){
    var ImageService = serviceLocator.serviceList.IDImage;
    var extended_url = '/GalleryImageUploadServlet';
    var uri = encodeURI(ImageService.serviceUrl+':'+ImageService.port+ImageService.base_url+extended_url);
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.mimeType = "image/jpeg";
    options.chunkedMode = true;
    var headers = {
      'Content-Type':'multipart/form-data',
      'merchant':$scope.authenticatedUser.merchantCode
    };
    options.headers = headers;
    $cordovaFileTransfer.upload(uri,fileURL, options).then(function(result) {
      if(result.responseCode==200){
        initGallery();
        $ionicLoading.hide();
        $ionicPopup.alert({
          title: $filter('translate')('SUCCESSFUL')+'!',
          template: $filter('translate')('IMAGE_UPLOAD_SUCCESSFUL')
        });
      }
    }, function(err) {
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: $filter('translate')('ERROR')+'!',
        template: $filter('translate')('IMAGE_UPLOAD_UNSUCCESSFUL')
      });
    }, function (progress) {
      $scope.uploadProgress = progress.loaded/progress.total*100;
      // console.log("Progress: " + $scope.uploadProgress);
    });
  }

  $scope.showImages = function(index) {
    // console.log(index);
    $scope.activeSlide = index;
    $scope.showModal('templates/gallery-zoomview.html');
  };

  $scope.showModal = function(templateUrl) {
    $ionicModal.fromTemplateUrl(templateUrl, {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modal.show();
    });
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.remove()
  };

  $scope.updateSlideStatus = function(slide) {
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };

});
