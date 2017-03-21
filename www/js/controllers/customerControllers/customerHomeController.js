/**
 * Created by SudeshNT on 11/1/2016.
 */
angular.module('starter').controller('customerHomeController', function ($scope,$state,serviceLocator,httpService,$ionicPopup) {
    $scope.backNavigation = 'home';
    $scope.deposit = {};
    $scope.deposit.cardType = 1;
    $scope.paymentGateways = [];

    initPaymentGateways();

    function initPaymentGateways(){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/getPaymentGateways';
      httpService.getRequest(payLeService,extended_url,{}).then(function(response){
        console.log(response);
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

    // $scope.deposit.merchantCode = parseInt('10041');
    $scope.merchantDeposit = function (isValid) {
      console.log($scope.sender);
       $scope.formSubmitted = true;
       if(isValid){
         var payLeService = serviceLocator.serviceList.PayLeService;
         var extended_url = '/merchant/deposit';
         var reqObj = {
           "merchantCode" : $scope.deposit.merchantCode,
           "paymentType" : $scope.deposit.cardType,
           "amount" : $scope.deposit.amount,
           "mobile" : $scope.deposit.customerMobile,
           "email" : $scope.deposit.customerEmail,
           "narration": $scope.deposit.comment
         };
          console.log(reqObj);
         httpService.postRequest(payLeService,extended_url,reqObj,{}).then(function(response){
           if(!response.errorMessage){
               console.log(response);
             $state.go('merchantDepositResponse', {depositResponse:response.deposit});
           }else{
             $scope.errorDeposit = response.errorMessage;
           }
         });
       }
    };
  var customerPaymentUrlPopup;

  $scope.openCustomerChatList = function () {
    $scope.startChatReq = {};

    customerPaymentUrlPopup = $ionicPopup.show({
        templateUrl: 'templates/customer/startChatPopup.html',
        cssClass: 'custom-class',
        scope: $scope
      });
      // $state.go('customerChatList');
    };

    $scope.startChat = function (isValid,chatEmail,chatCustomerName,sender) {
      $scope.formSubmitted = true;
      // console.log(chatCustomerName);
      if(isValid){
        customerPaymentUrlPopup.close();
        sender.name = sender.senderName;
        sender.customerName = chatCustomerName;
        $state.go('chat',{senderType:'merchant',sender:sender});
      }

    };

    $scope.closePopup = function () {
      customerPaymentUrlPopup.close();
    }

});

angular.module('starter').controller('merchantDepositResponseController', function ($scope,$filter,$state,$http,$stateParams,serviceLocator,httpService,$cordovaInAppBrowser) {

  if($stateParams.depositResponse == null || $stateParams.depositResponse == undefined || $stateParams.depositResponse == 'null' || $stateParams.depositResponse == 'undefined'){
    $state.go('customerHome');
  };
  console.log($stateParams.depositResponse);
  $scope.deposit = {
    "merchantCode":$stateParams.depositResponse.merchantCode,
    "businessName":$stateParams.depositResponse.businessName,
    "currency":$stateParams.depositResponse.currency,
    "amount":$stateParams.depositResponse.amount,
    "fullAmount":$stateParams.depositResponse.fullAmount,
    "mobile":$stateParams.depositResponse.buyer,
    "email":$stateParams.depositResponse.email,
    "cardType":$stateParams.depositResponse.paymentTypeString,
    "comment":$stateParams.depositResponse.narration,
    "fromCurrency":$stateParams.depositResponse.fromCurrency,
    "toCurrency":$stateParams.depositResponse.toCurrency,
    "transactionId" : $stateParams.depositResponse.transactionId,
  };

  // $scope.deposit = $stateParams.depositResponse;

  $scope.clickNext = function () {
    // console.log('next');
    if($scope.deposit.transactionId!=undefined){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/sendPayment';
      var reqObj = {
        "transactionId" : $scope.deposit.transactionId,
      };
      httpService.postRequest(payLeService,extended_url,reqObj,{}).then(function(response){
         console.log(response.data); // redirect to response.data
        // $state.go('commonMessage', {title:'Payment Successful !',message: '' ,backNavigation:'customerHome'});
        if(!response.errorMessage){
          var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'no'
          };
          // $http.get(response.data,{})
          //   .success(function(response){
          //     console.log(response);
          //   })
          //   .error(function(data){
          //     console.log('error');
          //     console.log(data);
          //   });
          $cordovaInAppBrowser.open(response.data, '_blank', options)
            .then(function(event) {
              // success
              console.log(JSON.stringify(event));
            })
            .catch(function(event) {
              console.log(JSON.stringify(event));
              // error
            });
        }else{
          $scope.errorMessage = response.errorMessage;
        }
      });
    }

  };

  $scope.doCheckout = function(token) {
    $state.go('commonMessage', {title:$filter('translate')('PAYMENT_SUCCESSFUL')+' !',message: 'payment token : '+ JSON.stringify(token) ,backNavigation:'customerHome'});
  };
});

angular.module('starter').controller('checkoutController', function ($scope,$state,$stateParams) {

});

angular.module('starter').controller('checkoutTestController', function ($scope,$state,$stateParams) {

});
