/**
 * Created by SudeshNT on 11/1/2016.
 */
angular.module('starter').controller('merchantHomeController', function ($scope,$state,$rootScope,$window,serviceLocator,httpService) {

  $scope.selectedType = 0;
  $scope.backNavigation = 'home';
  $scope.unreadMessageCount = 0;
  $scope.balance = {};
  $scope.messages = {};

  var refreshMerchantMessages = $rootScope.$on("refreshMerchantMessages", function(event, data){
    $scope.refreshMerchantMessages(data);
  });

  $scope.$on('$destroy', function() {
    refreshMerchantMessages(); // remove listener.
  });

  init();

  function init(){
    initBalances();
    initUnreadCustomerMessageCount();
  }

  function initBalances(){
    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/getBalance/'+$scope.authenticatedUser.merchantCode+'/'+$scope.authenticatedUser.sessionId;
    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      $scope.balance = response;
    });
  }

  function initUnreadCustomerMessageCount() {
    if(localStorage.getItem('adminMessages'+'_'+$scope.authenticatedUser.merchantCode)!=null || localStorage.getItem('customerMessages'+'_'+$scope.authenticatedUser.merchantCode)!=null) {
      if(localStorage.getItem('customerMessages'+'_'+$scope.authenticatedUser.merchantCode)!=null){
        $scope.messages = JSON.parse(localStorage.getItem('customerMessages'+'_'+$scope.authenticatedUser.merchantCode));
      }if(localStorage.getItem('adminMessages'+'_'+$scope.authenticatedUser.merchantCode)!=null){
        $scope.messages.admin = JSON.parse(localStorage.getItem('adminMessages'+'_'+$scope.authenticatedUser.merchantCode))['admin'];
      }
      for (var senderCode in $scope.messages) {
        if ($scope.messages.hasOwnProperty(senderCode)) {
          for (var i = 0; i < $scope.messages[senderCode].messages.length; i++) {
            if (!$scope.messages[senderCode].messages[i].read) {
              $scope.unreadMessageCount++;
            }
          }
        }
      }
    }
  }

  $scope.refreshMerchantMessages = function (data)  {
    $scope.unreadMessageCount++;
    $scope.$apply();
  };

  $scope.openAccordian1 = function (type) {
    if($scope.accordian1==true && $scope.selectedType==type){
      $scope.accordian1 = false;
    }else{
      $scope.selectedType = type;
      $scope.accordian1 = true;
    }
  };

  $scope.openPaymentUrlPage = function () {
    $state.go('paymentUrl');
  };

  $scope.opencivilIdPage = function () {
    $state.go('civilId');
  };

  $scope.openFeesPage = function () {
    $state.go('fees');
  };

  $scope.openChangePassword = function () {
    $state.go('changePassword');
  };

  $scope.openMerchantEdit = function () {
    $state.go('merchantEdit');
  };

  $scope.openMessages = function () {
    $state.go('messages');
  };

  $scope.openAboutUs = function () {
    $state.go('about_us');
  };

  $scope.openMediaPage = function () {
    $state.go('media');
  };

  $scope.openAllTransactionsPage = function () {
    $state.go('transactions.successful');
  };

  $scope.openWithdrawalsPage = function () {
    $state.go('withdrawals.successful');
  };

  $scope.openRequestWithdrawPage = function () {
    $state.go('requestWithdraw');
  };

  $scope.openGallery = function () {
    $state.go('gallery',{merchantCode:$scope.authenticatedUser.merchantCode,type:'merchant'});
  };

  $scope.logout = function () {
    localStorage.setItem('loginResponse',null);
    localStorage.setItem('loginStatus',false);
    $state.go('home');
  };

  $scope.reload = function () {
    // console.log('reload');
    $window.location.reload();
  }

});

angular.module('starter').controller('SelectRegionController', function ($scope,$state,$filter,serviceLocator,httpService) {
    $scope.title = $filter('translate')('SELECT_REGION');
    $scope.backNavigation = 'merchantLogin';

    loadRegions();

    function loadRegions (){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/regions';
      httpService.getRequest(payLeService,extended_url,{}).then(function(response){
        $scope.regions = response;
        console.log($scope.regions);
        var flag_rows = [];
        var slice = 3;
        for(var i=0;i<response.length;i++){
          if(flag_rows[Math.floor((i)/slice)]==undefined){
            flag_rows[Math.floor((i)/slice)] = [];
          }
          flag_rows[Math.floor((i)/slice)].push(response[i]);
        }
        $scope.flag_rows = flag_rows;
        console.log($scope.flag_rows);
      });
    }

    $scope.openRegisterPage = function (region) {
      $state.go('merchantRegister',{region:region});
    }
});

angular.module('starter').controller('MerchantRegisterController', function ($scope,$state,$filter,$stateParams,ionicDatePicker,$ionicPopup,dateFilter,serviceLocator,httpService,md5) {
  $scope.title = $filter('translate')('REGISTER');
  $scope.backNavigation = 'selectRegion';

  $scope.merchant = {};
  $scope.regions = [];
  $scope.banks = [];
  $scope.currencies = [];
  //init region
  if($stateParams.region!=''){
    console.log($stateParams.region);
    $scope.selectedRegion = $stateParams.region;
    loadBanks();
  }else{
    $state.go('selectRegion');
  }
  // $scope.merchant.iban = 'KW87NBOK0000000000001007784366';

  //loadRegions();
  //loadCurrency();

  // function loadCurrency(){
  //   var payLeService = serviceLocator.serviceList.PayLeService;
  //   var extended_url = '/merchant/getAllCurrencies';
  //   httpService.getRequest(payLeService,extended_url,{}).then(function(response){
  //     $scope.currencies = response;
  //     console.log($scope.currencies);
  //   });
  // }

  // function loadRegions (){
  //   var payLeService = serviceLocator.serviceList.PayLeService;
  //   var extended_url = '/merchant/regions';
  //   httpService.getRequest(payLeService,extended_url,{}).then(function(response){
  //     $scope.regions = response;
  //   });
  // }

  function loadBanks () {
    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/banks/'+$scope.selectedRegion.regionId;
    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      $scope.banks = response;
    });
  };

  $scope.registerMerchant = function (isValid) {
    $scope.formSubmitted = true;
    if(isValid){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/register';
      var fullName='';
      // if($scope.merchant.first_name!=undefined){
      //   fullName+=$scope.merchant.first_name;
      // }if($scope.merchant.middle_name!=undefined){
      //   fullName+=' '+$scope.merchant.middle_name;
      // }if($scope.merchant.last_name!=undefined){
      //   fullName+=' '+$scope.merchant.last_name;
      // }

      var reqObj = {
        // "name" : fullName,
        "firstName":$scope.merchant.first_name,
        "lastName":$scope.merchant.last_name,
        "businessName" : $scope.merchant.businessName,
        "dateOfBirth" : $scope.merchant.dateOfBirth,
        "regionId" : $scope.selectedRegion.regionId,
        "mobile" : $scope.merchant.mobile,
        "email" : $scope.merchant.email,
        "iban" : $scope.merchant.iban,
        "bankId" : $scope.merchant.bankId,
        // "cashAccountCurrency" : $scope.merchant.currency,
        // "bankAccountCurrency" : $scope.merchant.currency,
        "facebook":$scope.merchant.facebook,
        "twitter":$scope.merchant.twitter,
        "instagram":$scope.merchant.instagram
      };
      if($scope.merchant.middle_name!=undefined){
        reqObj.middleName = $scope.merchant.middle_name;
      }else{
        reqObj.middleName = '';
      }

      console.log(reqObj);
      httpService.postRequest(payLeService,extended_url,reqObj,{}).then(function(response){
        if(response.errorMessage==null){
          $state.go('commonMessage', {title:$filter('translate')('REGISTRATION_SUCCESSFUL')+' !',message: $filter('translate')('LOGIN_WITH_MERCHANT_CODE')+' : '+response.id,backNavigation:'merchantLogin'});
        }else{
          $scope.errorMessage = response.errorMessage;
        }
      });
    }
  };

  var ipObj1 = {
    callback: function (val) {  //Mandatory
      $scope.merchant.dateOfBirth =  dateFilter(new Date(val),'yyyy-MM-dd');
      ipObj1.inputDate = new Date(val);
    },
    from: new Date(1900, 1, 1), //Optional
    to: new Date(), //Optional
    inputDate: new Date(),      //Optional
    mondayFirst: true,          //Optional
    //disableWeekdays: [0],       //Optional
    closeOnSelect: true,       //Optional
    templateType: 'popup'       //Optional
  };

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(ipObj1);
  };

});

angular.module('starter').controller('MerchantEditProfileController', function ($scope,$state,$filter,ionicDatePicker,$ionicPopup,$ionicHistory,dateFilter,serviceLocator,httpService,$cordovaToast) {
  $scope.title = $filter('translate')('EDIT_PROFILE');
  $scope.backNavigation = 'merchantHome';
  //date picker object
  var ipObj1 = {
    callback: function (val) {  //Mandatory
      $scope.merchant.dateOfBirth =  dateFilter(new Date(val),'yyyy-MM-dd');
      ipObj1.inputDate = new Date(val);
    },
    from: new Date(1900, 1, 1), //Optional
    to: new Date(), //Optional
    inputDate: new Date(),      //Optional
    mondayFirst: true,          //Optional
    closeOnSelect: false,       //Optional
    templateType: 'popup'       //Optional
  };

  initMerchant();

  function initMerchant(){
    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/details/'+$scope.authenticatedUser.merchantCode+'/'+$scope.authenticatedUser.sessionId;
    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      // console.log(response);
      loadRegions();
      loadBanks(response.regionId);
      ipObj1.inputDate = new Date(response.dateOfBirth);
      $scope.merchant = response;
      $scope.merchant.region = $scope.merchant.regionId;
      // if(($scope.merchant.facebook!=null && $scope.merchant.facebook!='') || ($scope.merchant.twitter!=null && $scope.merchant.twitter!='') || ($scope.merchant.instagram!=null && $scope.merchant.instagram!=null)){
      //   $scope.merchant.isSharingSocialMediaAccounts = true;
      // }
    });

  }

  function loadRegions (){
    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/regions';
    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      $scope.regions = response;
    });
  }

  $scope.loadBanks = function(regionId){
    loadBanks(regionId);
  };

  function loadBanks(regionId) {
    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/banks/'+regionId;
    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      $scope.banks = response;
    });
  }

  $scope.editMerchant = function (isValid) {
    // console.log(isValid);
    $scope.formSubmitted = true;
    if(isValid){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/edit';
      var reqObj = {
        "merchantCode" : $scope.authenticatedUser.merchantCode,
        // "name" : $scope.merchant.name,
        "firstName":$scope.merchant.firstName,
        "middleName":$scope.merchant.middleName,
        "lastName":$scope.merchant.lastName,
        "mobile" : $scope.merchant.mobile,
        "email" : $scope.merchant.email,
        "iban" : $scope.merchant.iban,
        "dateOfBirth" : $scope.merchant.dateOfBirth,
        // "cashAccountCurrency" : "LKR",
        // "bankAccountCurrency" : "LKR",
        "businessName" : $scope.merchant.businessName,
        "bankId" : $scope.merchant.bankId,
        "facebook":$scope.merchant.facebook,
        "twitter":$scope.merchant.twitter,
        "instagram":$scope.merchant.instagram
      };
       // console.log(reqObj);
      httpService.putRequest(payLeService,extended_url,reqObj,{}).then(function(response){
        if(response.errorMessage==null){
          $ionicHistory.clearHistory();
          $cordovaToast.showLongBottom($filter('translate')('PROFILE_SUCCESSFULLY_EDITED')).then();
          $state.go('merchantHome');
          // $state.go('commonMessage', {title:$filter('translate')('PROFILE_SUCCESSFULLY_EDITED')+' !',message: $filter('translate')('GO_BACK_TO_MAIN_MENU'),backNavigation:'merchantHome'});
        }else{
          $scope.errorMessage = response.errorMessage;
        }
      });
    }
  };

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(ipObj1);
  };

});

angular.module('starter').controller('changePasswordController', function ($scope,$state,$filter,md5,$ionicHistory,serviceLocator,httpService) {
  $scope.title = $filter('translate')('CHANGE_PASSWORD');
  $scope.changePasswordReq = {};
  $scope.backNavigation = 'merchantHome';

  $scope.changePassword = function (isValid) {
    $scope.formSubmitted = true;

    if(isValid){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/changePassword';
      var reqObj = {
        "username" : $scope.authenticatedUser.merchantCode,
        "oldPassword" : md5.createHash($scope.authenticatedUser.merchantCode+$scope.changePasswordReq.currentPassword || ''),
        "newPassword" : md5.createHash($scope.authenticatedUser.merchantCode+$scope.changePasswordReq.newPassword || '')
      };
      httpService.putRequest(payLeService,extended_url,reqObj,{}).then(function(response){
        if(response.errorMessage==null){
          $ionicHistory.clearHistory();
          $state.go('commonMessage', {title:$filter('translate')('PASSWORD_SUCCESSFULLY_CHANGED')+' !',message: $filter('translate')('GO_BACK_TO_MAIN_MENU'),backNavigation:'merchantHome'});
        }else{
          $scope.errorMessage = response.errorMessage;
        }
      });
    }
  };

  $scope.togglePW = function () {
    $scope.showPasswordIsChecked = !$scope.showPasswordIsChecked;
  };

});

angular.module('starter').controller('forgotPasswordController', function ($scope,$state,$filter,$ionicHistory,serviceLocator,httpService) {

  $scope.forgotPasswordReq = {};

  $scope.requestForgotPassword = function (isValid) {
    $scope.formSubmitted = true;
    //$scope.forgotPasswordReq.merchantCode = 1480911141227;
    //$scope.forgotPasswordReq.email = 'sudeshnt93@gmail.com';
    if(isValid){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/forgotPassword';
      var reqObj = {
        // "username" : $scope.forgotPasswordReq.merchantCode,
        "email" : $scope.forgotPasswordReq.email
      };
      httpService.putRequest(payLeService,extended_url,reqObj,{}).then(function(response){
        if(response.errorMessage==null){
          $ionicHistory.clearHistory();
          $state.go('commonMessage', {title:$filter('translate')('PASSWORD_RESET_SUCCESSFUL')+' !',message: $filter('translate')('LOGIN_EMAIL_SENT'),backNavigation:'merchantLogin'});
        }else{
          $scope.errorMessage = response.errorMessage;
        }
      });
    }
  };

  $scope.togglePW = function () {
    $scope.showPasswordIsChecked = !$scope.showPasswordIsChecked;
  };

});

angular.module('starter').controller('merchantLoginController', function ($scope,$state,$ionicHistory,serviceLocator,httpService,md5,$rootScope) {

    if(localStorage.getItem('loginStatus')=='true'){
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $state.go('merchantHome');
    }
    $scope.backNavigation = 'home';
    $scope.userLoginDetails = {};

    $scope.authenticateUser = function (isValid) {
      $scope.formSubmitted = true;
      if(isValid){
        var payLeService = serviceLocator.serviceList.PayLeService;
        var extended_url = '/merchant/login';
        var reqObj = {
          username:$scope.userLoginDetails.merchantCode,
          password:md5.createHash($scope.userLoginDetails.merchantCode+$scope.userLoginDetails.password || ''),
          deviceIdKey:$rootScope.deviceToken
        };
        httpService.postRequest(payLeService,extended_url,reqObj,{}).then(function(loginResponse){
          if(loginResponse.status==0){
            localStorage.setItem('loginStatus',true);
            localStorage.setItem('loginResponse',JSON.stringify(loginResponse));
            $state.go('merchantHome');
          }else{
            $scope.loginError = loginResponse.errorMessage;
          }
        });
      }
    };

    $scope.openMerchantRegisterPage = function () {
      $state.go('selectRegion');
    }
});

angular.module('starter').controller('defaultPaymentUrlUrlController', function ($scope,$state,$filter,$cordovaClipboard,$cordovaToast) {
    $scope.title = $filter('translate')('DEFAULT_PAYMENT_URL');
    $scope.backNavigation = 'paymentUrl';

    $scope.paymentUrl = $scope.authenticatedUser.businessUrl;
    $scope.shareWith = false;
    $scope.clickShareWith = function () {
      //$scope.shareWith = true;
      if($scope.shareWith){
        $scope.shareWith = false;
      }else{
        $scope.shareWith = true;
      }
    };

    $scope.copyToClipboard = function () {
      $cordovaClipboard.copy($scope.paymentUrl).then(function() {
        $cordovaToast.showLongBottom($filter('translate')('COPIED_TO_CLIPBOARD')).then();
      }, function() {
        $cordovaToast.showLongBottom($filter('translate')('ERROR_WHILE_COPYING')).then();
      });
    };

    $scope.chooseAnAppToShare = function () {
      window.plugins.socialsharing.share('Payment Url', null, null, $scope.paymentUrl);
    };
    $scope.shareViaFacebook = function () {
      window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint('Payment Url via Facebook', null /* img */, $scope.paymentUrl, 'Paste it and Share!', function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };
    $scope.shareViaTwitter = function () {
      window.plugins.socialsharing.shareViaTwitter('Payment Url via Twitter', null /* img */, $scope.paymentUrl)
    };
    $scope.shareViaWhatsApp = function () {
      window.plugins.socialsharing.shareViaWhatsApp('Payment Url via WhatsApp', null /* img */, $scope.paymentUrl, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };
    $scope.shareViaText = function () {
      window.plugins.socialsharing.shareViaSMS($scope.paymentUrl, null /* see the note below */, function(msg) {console.log('ok: ' + msg)}, function(msg) {alert('error: ' + msg)})
    };

});

angular.module('starter').controller('PaymentUrlController', function ($scope,$state,$filter,$cordovaClipboard,$cordovaToast) {
    $scope.title = $filter('translate')('PAYMENT_URL');
    $scope.backNavigation = 'merchantHome';

    $scope.openDefaultURL = function () {
      $state.go('defaultPaymentUrl');
    };

    $scope.openCreateBillPage = function () {
      $state.go('createBill');
    };

});

angular.module('starter').controller('FeesController', function ($scope,$state,$filter,serviceLocator,httpService) {
  $scope.title = $filter('translate')('FEES');
  $scope.backNavigation = 'merchantHome';

  $scope.isMerchantSelected = 'selected';
  $scope.selectedCommissionType = 'merchantCommission';
  $scope.commissions = {};

  initCommissions();

  $scope.toggleTabs = function (tab) {

  }

  function initCommissions(){
    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/getCommissionByRegion/'+$scope.authenticatedUser.regionId;
    var commission = {};

    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      // console.log(response);
      for(var i=0;i<response.data.length;i++){
        commission = {
          flatAmount: response.data[i].currencyCode+' '+response.data[i].flatAmount,
          percentage: response.data[i].percentage + '%'
        };
        if(!$scope.commissions.hasOwnProperty(response.data[i].paymentType)){
          $scope.commissions[response.data[i].paymentType] = {};
        }
        if(response.data[i].commissionType == "Customer Commission"){
          $scope.commissions[response.data[i].paymentType].customerCommission=commission;
        }else if(response.data[i].commissionType == "Merchant Commission"){
          $scope.commissions[response.data[i].paymentType].merchantCommission=commission;
        }
      }
    });
  }

  $scope.toggleSelectedCommissionType = function (tab) {
    $scope.selectedCommissionType = tab+'Commission';

    switch (tab){
      case 'merchant':
        $scope.isMerchantSelected = 'selected';
        $scope.isCustomerSelected = '';
        break;
      case 'customer':
        $scope.isMerchantSelected = '';
        $scope.isCustomerSelected = 'selected';
        break;
    }

  }

});

angular.module('starter').controller('CreateBillController', function ($scope,$state,$filter,$ionicPopup,$cordovaClipboard,$cordovaToast,serviceLocator,httpService) {

    $scope.backNavigation = 'paymentUrl';
    $scope.paymentUrl = '';
    $scope.bill = {};
    $scope.bill.cardType = 1;

    initPaymentGateways();
    initMerchantCurrency();

    function initPaymentGateways(){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/getPaymentGateways';
      httpService.getRequest(payLeService,extended_url,{}).then(function(response){
        var ImageService = serviceLocator.serviceList.IDImage;
        var extended_url = '/PGImageView?image=';
        var uri = encodeURI(ImageService.serviceUrl+':'+ImageService.port+ImageService.base_url+extended_url);
        for(var i=0 ; i < response.length ; i++){
          response[i].imageUrl = uri+response[i].imageUrl
        }
        $scope.paymentGateways = response;
        // console.log($scope.paymentGateways);
      });
    };

    function initMerchantCurrency(){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/getMerchantAvailability/'+$scope.authenticatedUser.merchantCode;
      httpService.getRequest(payLeService,extended_url,{}).then(function(response){
        if(response.errorMessage==null){
          // console.log(response);
          $scope.merchantCurrencyCode = response.currencyCode;
        }
      });
    }

    var customerPaymentUrlPopup = null;

    $scope.createBill = function (isValid) {
      $scope.formSubmitted = true;
      if(isValid){
        var payLeService = serviceLocator.serviceList.PayLeService;
        var extended_url = '/merchant/getPaymentUrl';
        var reqObj = {
          "mobile" : $scope.bill.customerMobile,
          "merchantCode" : $scope.authenticatedUser.merchantCode,
          "amount" : $scope.bill.amount,
          "paymentType" : $scope.bill.cardType,
          "narration" : $scope.bill.comment
        };
        httpService.postRequest(payLeService,extended_url,reqObj,{}).then(function(response){
          console.log(response);
          if(response!=null){
            if(response.errorMessage==null){
              $scope.paymentUrl = response.url;
              customerPaymentUrlPopup = $ionicPopup.show({
                templateUrl: 'templates/merchant/paymentUrl/paymentUrlPopup.html',
                cssClass: 'custom-class',
                scope: $scope
              });
            }
          }
        });
      }
    };

    $scope.chooseAnAppToShare = function () {
      window.plugins.socialsharing.share('Payment Url', null, null, $scope.paymentUrl);
    };
    $scope.shareViaFacebook = function () {
      window.plugins.socialsharing.shareViaFacebookWithPasteMessageHint('Payment Url via Facebook', null /* img */, $scope.paymentUrl, 'Paste it and Share!', function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };
    $scope.shareViaTwitter = function () {
      window.plugins.socialsharing.shareViaTwitter('Payment Url via Twitter', null /* img */, $scope.paymentUrl)
    };
    $scope.shareViaWhatsApp = function () {
      window.plugins.socialsharing.shareViaWhatsApp('Payment Url via WhatsApp', null /* img */, $scope.paymentUrl, function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    };
    $scope.shareViaText = function () {
      window.plugins.socialsharing.shareViaSMS($scope.paymentUrl, null /* see the note below */, function(msg) {console.log('ok: ' + msg)}, function(msg) {alert('error: ' + msg)})
    };

    $scope.copyToClipboard = function () {
      $cordovaClipboard.copy($scope.paymentUrl).then(function() {
        $cordovaToast.showLongBottom($filter('translate')('COPIED_TO_CLIPBOARD')).then();
      }, function() {
        $cordovaToast.showLongBottom($filter('translate')('ERROR_WHILE_COPYING')).then();
      });
    };

    $scope.closePopup = function () {
      customerPaymentUrlPopup.close();
    }
});

angular.module('starter').controller('civilIdController', function ($scope,$state,$filter,$cordovaCamera,$cordovaFile,ionicDatePicker,$ionicLoading,$ionicPopup,$ionicHistory,dateFilter,$cordovaFileTransfer,serviceLocator,httpService) {
  $scope.title = $filter('translate')('CIVIL_ID');
  $scope.backNavigation = 'merchantHome';

  $scope.idStatus = {};
  $scope.backImgURI = null;
  $scope.frontImgURI = null;
  $scope.expiryDate =  dateFilter(new Date(),'yyyy-MM-dd');
  $scope.file = {};
  $scope.progressFront = 0;
  $scope.progressBack = 0;

  init();

  function init(){
    initId();
  }

  function initId(){

    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/getCivilIDDetails/'+$scope.authenticatedUser.merchantCode+'/'+$scope.authenticatedUser.sessionId;
    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      console.log(response);
      if(response.errorMessage==null){

         console.log(JSON.stringify(response));
        var idImageService = serviceLocator.serviceList.IDImage;
        var extended_url = '/IDImageView?image=';
        var uri = encodeURI(idImageService.serviceUrl+':'+idImageService.port+idImageService.base_url+extended_url);
        if((response.idBackURL!=null || response.idFrontURL!=null) && response.idExpiryDate != null){
          $scope.backImgURI = response.idBackURL!=null ? uri+response.idBackURL : null;
          $scope.frontImgURI = response.idFrontURL!=null ? uri+response.idFrontURL : null;
          $scope.expiryDate = dateFilter(new Date(response.idExpiryDate),'yyyy-MM-dd');
        }
        switch (response.status) {
          case 0:
            $scope.idStatus = {
              class:'not-submitted',
              text:$filter('translate')('ID_APPROVAL_NOT_SUBMITTED')
            };
            break;
          case 1:
            $scope.idStatus = {
              class:'id-pending',
              text:$filter('translate')('ID_APPROVAL_PENDING')
            };
            break;
          case 2:
            $scope.idStatus = {
              class:'id-approved',
              text:$filter('translate')('ID_APPROVAL_SUCCESSFUL')
            };
            break;
          case 5:
            $scope.idStatus = {
              class:'id-rejected',
              text:$filter('translate')('ID_APPROVAL_REJECTED')
            };
            break;
          default:
            break;
        }
      }
    });
  }

  $scope.takePicture = function(type,sourceType) {
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
      quality : 75,
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
      switch (type){
        case 'back':
          $scope.backImgURI = imageData;
          break;
        case 'front':
          $scope.frontImgURI = imageData;
          break;
        default:
          break;
      }
    }, function(err) {
      // An error occured. Show a message to the user
    });
  };

  $scope.takePicture2 = function(type,sourceType) {
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
      quality : 50,
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
      switch (type){
        case 'back':
          $scope.backImgURI = imageData;
          break;
        case 'front':
          $scope.frontImgURI = imageData;
          break;
        default:
          break;
      }
    }, function(err) {
      // An error occured. Show a message to the user
    });
  };

  var uploadedImages = {
    "B_url":null,
    "F_url":null
  };

  $scope.validateId = function () {
    $scope.uploadProgress = 0;
    if($scope.backImgURI && $scope.frontImgURI){
      $ionicLoading.show({
        template: '<ion-spinner icon="bubbles"></ion-spinner><br><span style="color:red;">Uploading... '+$scope.uploadProgress+'%</span><br><progress style="height: 6px;" max="100" value="'+$scope.uploadProgress+'"> </progress>',
        hideOnStateChange: true
      });
      console.log($scope.backImgURI);
      console.log($scope.frontImgURI);

      uploadImage($scope.backImgURI,'B',function () {
        uploadImage($scope.frontImgURI,'F',function () {
          var payLeService = serviceLocator.serviceList.PayLeService;
          var extended_url = '/merchant/updateIdDetails';
          var reqObj = {
            "idExpiryDate" : $scope.expiryDate
          };
          httpService.putRequest(payLeService,extended_url,reqObj,{}).then(function(response){
            if(response.errorMessage==null){
              localStorage.setItem('civilID_images',JSON.stringify(uploadedImages));
              $scope.idStatus = {
                class:'id-pending',
                text:$filter('translate')('ID_APPROVAL_PENDING')
              };
              $ionicLoading.hide();
              // $ionicHistory.clearHistory();
              $ionicPopup.alert({
                title: $filter('translate')('SUCCESSFUL')+'!',
                template: $filter('translate')('ID_SUBMIT_SUCCESSFUL')
              });
              // $state.go('commonMessage', {title:'ID Validation Successfully Submitted !',message: 'go back to main menu',backNavigation:'merchantHome'});
            }else{
              $scope.errorMessage = response.errorMessage;
            }
          });
        });
      });
    }else{
      $scope.errorMessage = $filter('translate')('INSERT_BOTH_SIDES_OF_ID');
    }
  };

  function uploadImage(fileURL,type,next){
    console.log(fileURL);

    var idImageService = serviceLocator.serviceList.IDImage;
    var extended_url = '/IDImageUpload';
    var uri = encodeURI(idImageService.serviceUrl+':'+idImageService.port+idImageService.base_url+extended_url);
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.mimeType = "image/jpeg";
    options.chunkedMode = true;
    var headers = {
      'Content-Type':'multipart/form-data',
      'merchant':$scope.authenticatedUser.merchantCode,
      'side':type
    };
    options.headers = headers;
    $cordovaFileTransfer.upload(uri,fileURL, options).then(function(result) {
      if(result.responseCode==200 && JSON.parse(result.response).filename!=null){
        uploadedImages[type+'_url'] = '/'+JSON.parse(result.response).filename;
        next();
        if(uploadedImages.B_url!=null && uploadedImages.F_url!=null && $scope.expiryDate!=null){

        }
      }
    }, function(err) {
      console.log("ERROR: " + JSON.stringify(err));
    }, function (progress){
      switch (type){
        case 'B':
          $scope.progressBack = progress.loaded/progress.total*100;
          break;
        case 'F':
          $scope.progressFront = progress.loaded/progress.total*100;
          break;
        default:
          break;
      }
      $scope.uploadProgress = ($scope.progressBack+$scope.progressFront)/2;
      // console.log("Progress: " + $scope.uploadProgress);
    });
  }

  var ipObj1 = {
    callback: function (val) {  //Mandatory
      $scope.expiryDate =  dateFilter(new Date(val),'yyyy-MM-dd');
      ipObj1.inputDate = new Date(val);
    },
    from: new Date(), //Optional
    to: new Date(2099, 12, 31), //Optional
    inputDate: new Date(),      //Optional
    mondayFirst: true,          //Optional
    disableWeekdays: [],       //Optional
    closeOnSelect: true,       //Optional
    templateType: 'popup'       //Optional
  };

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(ipObj1);
  };

  $scope.viewImage = function(type,image) {
    var title = null;
    switch (type){
      case 'Front':
        title = $filter('translate')('FRONT_SIDE');
        break;
      case 'Back':
        title = $filter('translate')('BACK_SIDE');
        break;
      default:
        break;
    }
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: '<img ng-src='+image+' style="max-width:100%; max-height:100%">'
    });
    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
    });
  };

  $scope.uploadCLicked = function (type) {
    switch (type){
      case 'back':
        $scope.backUploadClicked = true;
        break;
      case 'front':
        $scope.frontUploadClicked = true;
        break;
      default:
        break;
    }
  }
});

angular.module('starter').controller('messageController', function ($scope,$state,$rootScope,$filter,$ionicHistory) {
  $scope.title = $filter('translate')('MESSAGES');

  $scope.messages = {};

  $scope.senders = [];
  $scope.backNavigation = 'merchantHome';

  var refreshMerchantMessageList = $rootScope.$on("refreshMerchantMessageList", function(event, data){
    $scope.refreshMerchantMessageList(data);
  });
  //}
  $scope.$on('$destroy', function() {
    refreshMerchantMessageList(); // remove listener.
  });

  // //test
  // $scope.unreadMessages = {};
  // if(localStorage.getItem('adminUnreadMessages')!=null){
  //   $scope.unreadMessages.admin = JSON.parse(localStorage.getItem('adminUnreadMessages')).unreadMessageCount;
  // }
  // $rootScope.$watch('adminUnreadMessages',function () {
  //   $scope.adminUnreadMessages = $rootScope.adminUnreadMessages;
  //   $scope.$apply();
  // });

  initMessages();

  function initMessages(){
    if(localStorage.getItem('adminMessages'+'_'+$scope.authenticatedUser.merchantCode)!=null || localStorage.getItem('customerMessages'+'_'+$scope.authenticatedUser.merchantCode)!=null){
      if(localStorage.getItem('customerMessages'+'_'+$scope.authenticatedUser.merchantCode)!=null){
        $scope.messages = JSON.parse(localStorage.getItem('customerMessages'+'_'+$scope.authenticatedUser.merchantCode));
      }if(localStorage.getItem('adminMessages'+'_'+$scope.authenticatedUser.merchantCode)!=null){
        $scope.messages.admin = JSON.parse(localStorage.getItem('adminMessages'+'_'+$scope.authenticatedUser.merchantCode))['admin'];
      }
      // console.log($scope.messages);
      var sender = {};
      for (var senderCode in $scope.messages) {
        // if ($scope.messages.hasOwnProperty(senderCode) && senderCode!=localStorage.getItem('deviceToken')) {
          // console.log(JSON.stringify($scope.messages[senderCode]));
          sender = {
            senderCode: senderCode,
            senderName:$scope.messages[senderCode].senderName,
            lastMessage: $scope.messages[senderCode].messages[$scope.messages[senderCode].messages.length-1],
          };
          sender.unreadMessageCount = 0;
          for(var i=0;i<$scope.messages[senderCode].messages.length;i++){
              if(!$scope.messages[senderCode].messages[i].read){
                sender.unreadMessageCount++;
              }
          }
          $scope.senders.push(sender);
        // }
      }
      $scope.senders.reverse();
    }
  }

  $scope.refreshMerchantMessageList = function (data) {
    var senderFound = false;
    for(var i in $scope.senders){
      if($scope.senders[i].senderCode == data.sender.senderCode){
        $scope.senders[i].lastMessage = data.message;
        $scope.senders[i].unreadMessageCount++;
        senderFound = true;
        break;
      }
    }
    if(!senderFound){
      var sender = {
        senderCode: data.sender.senderCode,
        senderName: data.sender.senderName,
        lastMessage: data.message,
        unreadMessageCount:1
      };
      $scope.senders.push(sender);
    }
    $scope.$apply();
  };

  $scope.viewMessage = function (sender) {
    // $ionicHistory.clearHistory();
    // $ionicHistory.clearCache();
    // console.log(sender);
    if(sender.senderCode == 'admin'){
      $state.go('chat',{senderType:'admin',sender:sender});
    }else{
      $state.go('chat',{senderType:'customer',sender:sender});
    }

  }
});

angular.module('starter').controller('messageContentController', function ($scope,$state,$stateParams) {
   $scope.message = $stateParams.message;
});

angular.module('starter').controller('AboutUsController', function ($scope,$state,$rootScope,serviceLocator,httpService) {
  $scope.backNavigation = 'merchantHome';
  $scope.content = '';
  initAboutUs();

  function initAboutUs(){
    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/getAboutUsContext/'+$scope.authenticatedUser.regionId+'/'+$rootScope.language;
    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      $scope.content = response;
    });
  }

});

angular.module('starter').controller('MediaController', function ($scope,$state,$filter,serviceLocator,httpService,youtubeEmbedUtils) {
  $scope.title = $filter('translate')('MEDIA');
  $scope.backNavigation = 'merchantHome';

  $scope.playerVars = {
    controls: 2,
    autoplay: 0
  };

  init();

  function init() {
    initMedia();
  }

  function initMedia(){
    var payLeService = serviceLocator.serviceList.PayLeService;
    var extended_url = '/merchant/videoLinkByRegion/'+$scope.authenticatedUser.regionId;
    httpService.getRequest(payLeService,extended_url,{}).then(function(response){
      $scope.media = response;
      // console.log($scope.media);
      for(var i=0;i<$scope.media.length;i++){
        $scope.media[i].videoId = youtubeEmbedUtils.getIdFromURL($scope.media[i].url);
      }
      // console.log($scope.media);
    });
  }
});

angular.module('starter').controller('TransactionTabController', function ($scope,$state,$stateParams,$filter) {
  $scope.type = $stateParams.type;
  $scope.backNavigation = "merchantHome";
  switch ($state.current.name.split(".")[0]) {
    case 'transactions':
      $scope.title = $filter('translate')('TRANSACTIONS');
      break;
    case 'withdrawals':
      $scope.title = $filter('translate')('WITHDRAWALS');
      break;
    default:
      break;
  }
});

angular.module('starter').controller('TransactionController', function ($scope,$state,$ionicHistory,dateFilter,serviceLocator,httpService,$cordovaToast,$ionicPopup,$filter) {
  $ionicHistory.clearCache();
  $scope.dateFilter = dateFilter;
  //$scope.transactions = {"offset":0,"limit":10,"recordCount":9,"status":1,"errorCode":null,"pageNumber":1,"data":[{"transactionId":10,"dateTime":1478516979000,"amount":1220220202.00000,"status":1,"buyer":"Rohan","commission":0.00000,"fromCurrency":"LKR","toCurrency":"LKR","narration":null},{"transactionId":9,"dateTime":1478516976000,"amount":120220202.00000,"status":1,"buyer":"Rohan","commission":0.00000,"fromCurrency":"LKR","toCurrency":"LKR","narration":null},{"transactionId":8,"dateTime":1478516974000,"amount":12020202.00000,"status":1,"buyer":"Rohan","commission":0.00000,"fromCurrency":"LKR","toCurrency":"LKR","narration":null},{"transactionId":7,"dateTime":1478516971000,"amount":1200202.00000,"status":1,"buyer":"Rohan","commission":0.00000,"fromCurrency":"LKR","toCurrency":"LKR","narration":null},{"transactionId":6,"dateTime":1478516969000,"amount":120002.00000,"status":1,"buyer":"Rohan","commission":0.00000,"fromCurrency":"LKR","toCurrency":"LKR","narration":null},{"transactionId":5,"dateTime":1478516966000,"amount":10002.00000,"status":1,"buyer":"Rohan","commission":0.00000,"fromCurrency":"LKR","toCurrency":"LKR","narration":null},{"transactionId":4,"dateTime":1478516961000,"amount":10001.00000,"status":1,"buyer":"Rohan","commission":0.00000,"fromCurrency":"LKR","toCurrency":"LKR","narration":null},{"transactionId":3,"dateTime":1478516957000,"amount":10001.00000,"status":1,"buyer":"Rohan","commission":0.00000,"fromCurrency":"LKR","toCurrency":"LKR","narration":null},{"transactionId":2,"dateTime":1478516948000,"amount":1000.00000,"status":1,"buyer":"Rohan","commission":0.00000,"fromCurrency":"LKR","toCurrency":"LKR","narration":null}]};
  $scope.transactions = [];
  $scope.noMoreItemsAvailable = false;
  var offset = 0;
  var limit = 10;
  var extended_url = null;
  var type = null;
  init();
  function init(){
    switch ($state.current.name.split(".")[0]) {
      case 'transactions':
        $scope.type = 'transactions';
        extended_url = '/merchant/transactionsByStatus';
        break;
      case 'withdrawals':
        $scope.type = 'withdrawals';
        extended_url = '/merchant/withdrawsByStatus';
        break;
      default:
        break;
    }
    switch ($state.current.name.split(".")[1]) {
      case 'successful':
        type = serviceLocator.statusList.APPROVED;
        break;
      case 'pending':
        type = serviceLocator.statusList.PENDING;
        break;
      case 'rejected':
        type = serviceLocator.statusList.REJECTED;
        break;
      default:
        break;
    }
    loadTransactions();
  }

  function loadTransactions(){
    $scope.noMoreItemsAvailable = true;
    var payLeService = serviceLocator.serviceList.PayLeService;
    var reqObj = {
      "offset":offset,
      "limit":limit,
      "pageNumber":'',
      "key":$scope.authenticatedUser.merchantCode,
      "id":type
    };
    // console.log(reqObj);
    httpService.postRequest(payLeService,extended_url,reqObj,{}).then(function(response){
      // console.log(response);
      if(response!=null){
        // console.log(response);
        if( response.status>=0){
          if(response.data.length>0){
            offset+=limit;
            for(var i in response.data){
              response.data[i].formattedDate = dateFilter(response.data[i].date,'yyyy-MM-dd hh:mm a');
              // console.log(response.data[i]);
              $scope.transactions.push(response.data[i]);
            }
            $scope.noMoreItemsAvailable = false;
          }else{
            $cordovaToast.showLongBottom($filter('translate')('THATS_ALL_'+$state.current.name.split(".")[1].toUpperCase()+'_'+$state.current.name.split(".")[0].toUpperCase())).then();
            $scope.noMoreItemsAvailable = true;
          }
        }
      }
    });
  };

  $scope.loadMore = function() {
    init();
  };

  $scope.viewTransition = function (transaction) {
    var template = '';
    switch ($state.current.name.split(".")[0]) {
      case 'transactions':
        template='<span class="full-width" style="font-size: 11px;">'+$filter('translate')('BUYER_MOBILE')+'</span>'+
          '<input type="text" ng-model="selectedTransaction.buyer" readonly>'+
          '<span class="full-width" style="font-size: 11px;">'+$filter('translate')('AMOUNT')+'</span>'+
          '<input type="text" ng-model="selectedTransaction.fullAmount" readonly>'+
          '<span class="full-width" style="font-size: 11px;">'+$filter('translate')('TRANSACTION_DATE')+'</span>'+
          '<input type="text" ng-model="selectedTransaction.formattedDate" readonly>'+
          '<span class="full-width" style="font-size: 11px;">'+$filter('translate')('EXTERNAL_REF')+'</span>'+
          '<input type="text" ng-model="selectedTransaction.externalRef" readonly>'+
          '<span class="full-width" style="font-size: 11px;">'+$filter('translate')('FEE')+'</span>'+
          '<input type="text" ng-model="selectedTransaction.merchantCommission" readonly>'+
          '<span class="full-width" style="font-size: 11px;">'+$filter('translate')('STATUS')+'</span>'+
          '<input type="text" ng-model="selectedTransaction.statusText" readonly>'+
          '<span class="full-width" style="font-size: 11px;">'+$filter('translate')('COMMENTS')+'</span>'+
          '<input type="text" ng-model="selectedTransaction.narration" readonly>';
        break;
      case 'withdrawals':
        template=
          '<span class="full-width" style="font-size: 11px;">'+$filter('translate')('AMOUNT')+'</span>'+
          '<span style="font-size: 11px;">({{selectedTransaction.fromCurrency}})</span><input type="text" ng-model="selectedTransaction.transactionAmount" readonly>'+
          '<span class="full-width" style="font-size: 11px;">'+$filter('translate')('TRANSACTION_DATE')+'</span>'+
          '<input type="text" ng-model="selectedTransaction.formattedDate" readonly>'+
          '<span class="full-width" style="font-size: 11px;">'+$filter('translate')('STATUS')+'</span>'+
          '<input type="text" ng-model="selectedTransaction.statusText" readonly>'+
          '<span class="full-width" style="font-size: 11px;" ng-if="selectedTransaction.statusText==\'APPROVED\'">'+$filter('translate')('APPROVED_DATE')+'</span>'+
          '<input type="text" ng-model="selectedTransaction.approvedDate" ng-if="selectedTransaction.statusText==\'APPROVED\'" readonly>'
        break;
      default:
        break;
    }
    $scope.selectedTransaction = transaction;
    // console.log($scope.selectedTransaction);
    $scope.selectedTransaction.date = dateFilter(new Date($scope.selectedTransaction.date),'yyyy-MM-dd');
    for (var key in serviceLocator.statusList) {
      if (serviceLocator.statusList.hasOwnProperty(key) && serviceLocator.statusList[key]==$scope.selectedTransaction.status) {
        $scope.selectedTransaction.statusText = key;
      }
    }
    $scope.selectedTransaction.status = serviceLocator;

    $ionicPopup.show({
      template: template,
      title: $filter('translate')('TRANSACTION')+' : '+transaction.transactionId,
      scope: $scope,
      buttons: [
        { text: $filter('translate')('CANCEL') ,
          type: 'button-positive'
        },
        // {
        //   text: '<b>Save</b>',
        //   type: 'button-positive',
        //   onTap: function(e) {
        //     if (!$scope.data.wifi) {
        //       //don't allow the user to close unless he enters wifi password
        //       e.preventDefault();
        //     } else {
        //       return $scope.data.wifi;
        //     }
        //   }
        // }
      ]
    });
  }
});

angular.module('starter').controller('WithdrawalController', function ($scope,$state,$filter,dateFilter,$ionicPopup,serviceLocator,httpService) {

    $scope.title = $filter('translate')('REQUEST_WITHDRAWALS');
    $scope.withdrawRequest = {};
    $scope.bankAccounts = [];
    $scope.idStatus = {
      class:'approved'
    };

    $scope.backNavigation = 'merchantHome';

    init();

    function init() {
      $scope.idStatus = {
        class:'approved',
        text:$filter('translate')('ID_APPROVAL_SUCCESSFUL')
      };
      // initIdStatus();
      initBankAccounts();
    }

    function initIdStatus(){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/getCivilIDDetails/'+$scope.authenticatedUser.merchantCode+'/'+$scope.authenticatedUser.sessionId;
      httpService.getRequest(payLeService,extended_url,{}).then(function(response){
        if(response.errorMessage==null){
          switch (response.status) {
            case 0:
              $scope.idStatus = {
                class:'not-submitted',
                text:$filter('translate')('ID_APPROVAL_NOT_SUBMITTED')
              };
              break;
            case 1:
              $scope.idStatus = {
                class:'pending',
                text:$filter('translate')('ID_APPROVAL_PENDING')
              };
              break;
            case 2:
              $scope.idStatus = {
                class:'approved',
                text:$filter('translate')('ID_APPROVAL_SUCCESSFUL')
              };
              break;
            case 5:
              $scope.idStatus = {
                class:'rejected',
                text:$filter('translate')('ID_APPROVAL_REJECTED')
              };
              break;
            default:
              break;
          }
        }
      });
    }

    function initBankAccounts(){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/bankAccounts/'+$scope.authenticatedUser.merchantCode+'/'+$scope.authenticatedUser.sessionId;
      // console.log($scope.authenticatedUser.merchantCode);
      httpService.getRequest(payLeService,extended_url,{}).then(function(response){
        if(!response.errorCode){
          //console.log(response.data[0]);
          //$scope.bankAccounts = response;
          $scope.actualBalance = response.availableAmount;
          $scope.fromCurrency = response.data[0].currencyCode;
        }
      });
    }

    $scope.requestWithdrawal = function (isValid) {
      $scope.formSubmitted = true;
      if(isValid){
        // if($scope.withdrawRequest.amount <= $scope.actualBalance){
          var payLeService = serviceLocator.serviceList.PayLeService;
          var extended_url = '/merchant/withdraw';
          var reqObj = {
            "merchantCode":$scope.authenticatedUser.merchantCode,
            "cashAccount":'',
            "bankAccount": '',
            "amount":$scope.withdrawRequest.amount,
            "narration":$scope.withdrawRequest.comment
          };
          console.log(reqObj);
          httpService.postRequest(payLeService,extended_url,reqObj,{}).then(function(response){
            if(!response.errorMessage){
              $ionicPopup.alert({
                title: $filter('translate')('SUCCESSFUL')+'!',
                template: $filter('translate')('WITHDRAW_REQUEST_SENT')+' !'
              }).then(function() {
                $state.go('merchantHome');
              });
            }else{
              $ionicPopup.alert({
                title: $filter('translate')('ERROR')+'!',
                template: response.errorMessage
              });
              $scope.errorMessage = response.errorMessage;
            }
          });
        // }else{
        //   console.log('request more than actual balance');
        // }
      }
    }

});
