// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic',
                          'ngCordova',
                          'ionic-datepicker',
                          'pascalprecht.translate',
                          'lang_en',
                          'lang_ar',
                          'youtube-embed',
                          'angular-md5',
                          'ngMaterial',
                          'mm.iban',
                          'ionic.contrib.frostedGlass',
                          "stripe.checkout"
                          ])

.run(function($window,$filter,$ionicPlatform,$ionicPopup,RequestsService,$state,$stateParams,$cordovaToast,dateFilter,$rootScope,$cordovaNativeAudio,serviceLocator,httpService,$cordovaPush) {

  //device ready on notification test

  $ionicPlatform.ready(function() {

    $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
      // console.log('on notification bitch');
      if (notification.alert) {
        navigator.notification.alert(notification.alert);
      }

      if (notification.sound) {
        var snd = new Media(event.sound);
        snd.play();
      }

      if (notification.badge) {
        $cordovaPush.setBadgeNumber(notification.badge).then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });
      }
    });

    //preload sounds
    $cordovaNativeAudio.preloadSimple('notification', 'audio/notification.mp3');
    initAdds();

    setTimeout(function() {
      navigator.splashscreen.hide();
    }, 300);
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    /*if(typeof navigator.globalization !== "undefined") {
      navigator.globalization.getPreferredLanguage(function(language) {
        $translate.use((language.value).split("-")[0]).then(function(data) {
          console.log("SUCCESS -> " + data);
        }, function(error) {
          console.log("ERROR -> " + error);
        });
      }, null);
    }*/
    // var senders = [
    //   {
    //     senderCode: 1479722455625,
    //     senderType:'customer',
    //     senderName:'Sudesh N.',
    //     lastMessage: "Sorry, your payment failed.",
    //     lastMessageReceivedAt: '2016-11-10 02.36 PM'
    //   }, {
    //     senderCode: 1479729109523,
    //     senderType:'merchant',
    //     senderName:'Rohan1',
    //     lastMessage: "No charges were made.Really sorry",
    //     lastMessageReceivedAt: '2016-10-15 11.36 AM'
    //   }, {
    //     senderCode: 1479729228008,
    //     senderType:'customer',
    //     senderName:'Sudesh',
    //     lastMessage: "Thank You!",
    //     lastMessageReceivedAt: '2016-10-10 12.36 PM'
    //   }, {
    //     senderCode: 1479883696087,
    //     senderType:'merchant',
    //     senderName:'Nimesha T.',
    //     lastMessage: "Thank You!",
    //     lastMessageReceivedAt: '2016-10-10 12.36 PM'
    //   }
    // ];
    pushNotification = window.plugins.pushNotification;

    window.onNotification = function(e){
      switch(e.event){
        case 'registered':
          if(e.regid.length > 0){
            var device_token = e.regid;
            if(localStorage.getItem('deviceToken') == undefined || localStorage.getItem('deviceToken')!=device_token){
              localStorage.setItem('deviceToken',device_token);
            }
            // console.log(localStorage.getItem('deviceToken'));
            // RequestsService.register(device_token).then(function(response){
            //   $cordovaToast.showShortBottom("registered for push notification!").then();
            // });
          }
          break;
        case 'message':
          console.log(JSON.stringify(e));
          var  sender = {
            senderType:e.payload.info.type
          };
          var from = null;
          switch (e.payload.info.type){
            case 'customer':
              if(e.payload.info.customerDeviceKey!=null){
                //mobile customer
                sender.senderCode=e.payload.info.customerDeviceKey;
              }else{
                //web customer
                sender.senderCode=e.payload.info.chatSessionId;
              }
              sender.senderName=e.payload.info.name;
              from = e.payload.info.name;
              break;
            case 'merchant':
              sender.senderCode=e.payload.info.merchantCode;
              sender.senderName=e.payload.info.name;
              from = sender.senderType+' '+sender.senderName;
              break;
            case 'admin':
              sender.senderCode=e.payload.info.type;
              sender.senderName=e.payload.info.name;
              from = sender.senderName;
              break;
          }
          if(e.foreground){
            // console.log('foreground');
            $cordovaNativeAudio.play('notification');
            if($state.current.name!='chat'){
              // console.log('not chat');
              pushMessageToLocalStorage(sender,e,'');
              // $rootScope.$emit("CallParentMethod", {merchant:merchant,sender:'Anne',message:e.message,date:dateFilter(new Date(),'yy-MMM-d hh:mm:ss a')});
              $ionicPopup.confirm({
                title: $filter('translate')('NEW_MESSAGE_FROM')+from,
                template: e.payload.info.body.substring(0, 15)+'...'+'<br><br> ' + $filter('translate')('WANT_TO_OPEN_CHAT_WINDOW')
              }).then(function(res){
                if(res) {
                  //check if sender type is customer if customer then
                  //check if the merchant is logged in : if logged in go to chat
                  //if not go to loggin page
                  console.log(sender.senderType);
                  console.log(localStorage.getItem('loginStatus'));
                  if(sender.senderType == 'customer'){
                    if(localStorage.getItem('loginStatus')=="true"){
                      $state.go('chat',{senderType:sender.senderType,sender:sender});
                    }else{
                      $state.go('merchantLogin');
                    }
                  }
                }else {
                  //$window.location.reload();
                }
              });
            }else{
              // console.log('chat');
              $rootScope.$emit("receiveMessage", {sender:sender,message:e.payload.info.body,date:dateFilter(new Date(e.payload.info.time),'yy-MMM-d hh:mm:ss a')});
            }
          }else{
            // console.log('not foreground');
            pushMessageToLocalStorage(sender,e,function goToChat(){
              $state.go('chat',{senderType:sender.senderType,sender:sender});
            });
          }
          break;
        case 'error':
          alert('error occured');
          break;
      }
    };

    function pushMessageToLocalStorage (sender,e,next){
      var messages = {};
      var icon = '';
      var messageType = null;

      switch (sender.senderType) {
        case 'merchant' :
          icon = 'img/message_icon/m.png';
          messageType = sender.senderType+'Messages'+'_'+localStorage.getItem('deviceToken');
          break;
        case 'customer' :
          icon = 'img/message_icon/c.png';
          messageType = sender.senderType+'Messages'+'_'+JSON.parse(localStorage.getItem('loginResponse')).merchantCode;
          break;
        case 'admin' :
          icon = 'img/message_icon/a.png';
          messageType = sender.senderType+'Messages'+'_'+JSON.parse(localStorage.getItem('loginResponse')).merchantCode;
          break;
      }
      var nextMessage = {
        messageType:'received',
        read:false,
        dateTime: dateFilter(new Date(e.payload.info.time),'yy-MMM-d hh:mm:ss a'),
        sender: {
          name: sender.senderName,
          profilePic: icon
        },
        content: {
          type:'text',
          content: e.payload.info.body
        }
      };
      if(localStorage.getItem(messageType)!=null){
        messages = JSON.parse(localStorage.getItem(messageType));
      }
      if(!messages.hasOwnProperty(sender.senderCode)){
         messages[sender.senderCode] = {
          senderName:sender.senderName,
          messages:[]
        };
      }
      messages[sender.senderCode].messages.push(angular.extend({}, nextMessage));
      localStorage.setItem(messageType,JSON.stringify(messages));

      switch ($state.current.name) {
        case 'merchantHome' :
          $rootScope.$emit("refreshMerchantMessages",{});
          break;
        case 'messages' :
          $rootScope.$emit("refreshMerchantMessageList", {sender:sender,message:nextMessage});
          break;
        case 'customerChatList' :
          break;
      }

      //unread messages
      // if(localStorage.getItem(sender.senderType+'UnreadMessages')!=null){
      //   unreadMessages = JSON.parse(localStorage.getItem(sender.senderType+'UnreadMessages'));
      // }
      // if(!unreadMessages.hasOwnProperty(sender.senderCode)){
      //   unreadMessages[sender.senderCode] = {
      //     unreadMessageCount:0
      //   };
      // }
      // unreadMessages[sender.senderCode].unreadMessageCount++;
      // $rootScope[sender.senderType+'UnreadMessages'] = unreadMessages;
      //
      // localStorage.setItem(sender.senderType+'UnreadMessages',JSON.stringify(unreadMessages));

      if(next!=''){
        next();
      }
    }

    function initAdds(){
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/getVisibleAd';
      httpService.getRequest(payLeService,extended_url,{}).then(function(response){
        localStorage.setItem('adds',JSON.stringify(response));
        // console.log(response);
      });
    }

    window.errorHandler = function(error){
      alert('an error occured');
    };

    pushNotification.register(
      onNotification,
      errorHandler,
      {
        'badge': 'true',
        'sound': 'true',
        'alert': 'true',
        'senderID': '1033794095892',
        'ecb': 'onNotification'
      }
    );
  });
})

.config(function($stateProvider, $urlRouterProvider,$translateProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'templates/home.html',
      controller: 'homeController'
    })
    .state('customerHome', {
      url: '/customerHome',
      templateUrl: 'templates/customer/merchantDeposit.html',
      controller: 'customerHomeController'
    })
    .state('merchantDepositResponse', {
      url: '/merchantDepositResponse',
      templateUrl: 'templates/customer/merchantDepositResponse.html',
      controller: 'merchantDepositResponseController',
      params : {depositResponse:'null'}
    })
    .state('merchantHome', {
      url: '/merchantHome',
      templateUrl: 'templates/merchant/merchantHome.html',
      controller: 'merchantHomeController'
    })
    .state('paymentUrl', {
      url: '/paymentUrl',
      templateUrl: 'templates/merchant/paymentUrl/paymentUrl.html',
      controller: 'PaymentUrlController'
    })
    .state('defaultPaymentUrl', {
      url: '/defaultPaymentUrl',
      templateUrl: 'templates/merchant/paymentUrl/defaultPaymentUrl.html',
      controller: 'defaultPaymentUrlUrlController'
    })
    .state('createBill', {
      url: '/createBill',
      templateUrl: 'templates/merchant/paymentUrl/createBill.html',
      controller: 'CreateBillController',
    })
    .state('civilId', {
      url: '/civilId',
      templateUrl: 'templates/merchant/civilId.html',
      controller: 'civilIdController'
    })
    .state('changePassword', {
      url: '/changePassword',
      templateUrl: 'templates/merchant/profile/changePassword.html',
      controller: 'changePasswordController'
    })
    .state('forgotPassword', {
      url: '/forgotPassword',
      templateUrl: 'templates/merchant/profile/forgotPassword.html',
      controller: 'forgotPasswordController'
    })
    .state('merchantLogin', {
      url: '/merchantLogin',
      templateUrl: 'templates/merchant/merchantLogin.html',
      controller: 'merchantLoginController'
    })
    .state('messages', {
      url: '/messages',
      templateUrl: 'templates/merchant/messages/messages.html',
      controller: 'messageController'
    })
    .state('messageContent', {
      url: '/messageContent',
      templateUrl: 'templates/merchant/messages/messageContent.html',
      controller: 'messageContentController',
      params:{message:''}
    })
    .state('about_us', {
      url: '/about_us',
      templateUrl: 'templates/merchant/aboutUs.html',
      controller: 'AboutUsController'
    })
    .state('media', {
      url: '/media',
      templateUrl: 'templates/merchant/media.html',
      controller: 'MediaController'
    })
    .state('fees', {
      url: '/fees',
      templateUrl: 'templates/merchant/fees.html',
      controller: 'FeesController'
    })
    .state('requestWithdraw', {
      url: '/requestWithdraw',
      templateUrl: 'templates/merchant/transactions/withdrawals/requestWithdraw.html',
      controller: 'WithdrawalController'
    })
    .state('all-transactions', {
      url: '/all-transactions',
      templateUrl: 'templates/merchant/transactions/allTransactions.html',
      controller: 'TransactionController'
    })
    /*.state('withdrawals', {
      url: '/withdrawals',
      templateUrl: 'templates/merchant/transactions/withdrawals.html',
      controller: 'TransactionController'
    })*/
     .state('selectRegion', {
      url: '/selectRegion',
      templateUrl: 'templates/merchant/selectRegionPage.html',
      controller: 'SelectRegionController'
    })
    .state('merchantRegister', {
      url: '/merchantRegister',
      templateUrl: 'templates/merchant/merchantRegister.html',
      controller: 'MerchantRegisterController',
      params:{region:''}
    })
    .state('merchantEdit', {
      url: '/merchantEdit',
      templateUrl: 'templates/merchant/profile/editProfile.html',
      controller: 'MerchantEditProfileController'
    })
    //withdrawal tabs
    .state('withdrawals', {
      url: '/withdrawals',
      abstract: true,
      templateUrl: 'templates/merchant/transactions/transactionsTabs.html',
      controller:'TransactionTabController',
      params:{type:'withdrawals'}
    })
    .state('withdrawals.successful', {
      url: '/successful',
      views: {
        'tab-successful': {
          templateUrl: 'templates/merchant/transactions/allTransactions.html',
          controller: 'TransactionController'
        }
      }
    })
    .state('withdrawals.pending', {
      url: '/pending',
      views: {
        'tab-pending': {
          templateUrl: 'templates/merchant/transactions/allTransactions.html',
          controller: 'TransactionController'
        }
      }
    })
    .state('withdrawals.rejected', {
      url: '/rejected',
      views: {
        'tab-rejected': {
          templateUrl: 'templates/merchant/transactions/allTransactions.html',
          controller: 'TransactionController'
        }
      }
    })
    //transactions tabs
    .state('transactions', {
      url: '/transactions',
      abstract: true,
      templateUrl: 'templates/merchant/transactions/transactionsTabs.html',
      controller:'TransactionTabController',
      params:{type:'transactions'}
    })
    .state('transactions.successful', {
      url: '/successful',
      views: {
        'tab-successful': {
          templateUrl: 'templates/merchant/transactions/allTransactions.html',
          controller: 'TransactionController'
        }
      }
    })
    .state('transactions.pending', {
      url: '/pending',
      views: {
        'tab-pending': {
          templateUrl: 'templates/merchant/transactions/allTransactions.html',
          controller: 'TransactionController'
        }
      }
    })
    .state('transactions.rejected', {
      url: '/rejected',
      views: {
        'tab-rejected': {
          templateUrl: 'templates/merchant/transactions/allTransactions.html',
          controller: 'TransactionController'
        }
      }
    })
    //common message page
    .state('commonMessage', {
      url: '/commonMessage',
      templateUrl: 'templates/common/commonMessagePage.html',
      controller: 'CommonMessageController',
      params : {title:'null',message:'null',backNavigation:'null'}
    })
    //chat
    .state('chat', {
      url: '/chat',
      templateUrl: 'templates/chat/chat.html',
      controller: 'ChatController',
      params : {senderType:'',sender:''}
    })
    .state('customerChatList', {
      url: '/customerChatList',
      templateUrl: 'templates/chat/customerChatList.html',
      controller: 'CustomerChatListController'
    })
    .state('checkout', {
      url: '/checkout',
      templateUrl: 'templates/customer/checkout.html',
      controller: 'checkoutController'
    })
    .state('checkout_test', {
      url: '/checkout_test',
      templateUrl: 'templates/customer/checkoutTest.html',
      controller: 'checkoutTestController'
    })
    .state('gallery', {
      url: '/gallery',
      templateUrl: 'templates/common/gallery.html',
      controller: 'galleryController',
      params : {merchantCode:'',type:''}
    })
    $urlRouterProvider.otherwise('/home');
    // chosen on application start is English and the fallback in case a translation does not exist, will be English as well.
    $translateProvider.preferredLanguage("en");
    $translateProvider.forceAsyncReload(true);
    //$translateProvider.fallbackLanguage("en");
})

.controller("initialController",function($scope,$rootScope,$state,$translate,pendingRequests,$ionicLoading,$ionicHistory,RequestsService,$cordovaToast,$cordovaNativeAudio,dateFilter,serviceLocator,httpService) {
  $scope.imageUriBase = serviceLocator.serviceList.IDImage.serviceUrl+':'+serviceLocator.serviceList.IDImage.port+serviceLocator.serviceList.IDImage.base_url+'/AdvertisementImageView?image=';
  initAdds();

  $rootScope.$on('$stateChangeStart', function (event,toState) {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
    initAdds();
    if(localStorage.getItem('loginStatus')=='true' && localStorage.getItem('loginResponse')!=null && localStorage.getItem('loginResponse')!='null' && localStorage.getItem('loginResponse')!='' && localStorage.getItem('loginResponse')!=undefined && localStorage.getItem('loginResponse')!='undefined'){
      $scope.authenticatedUser = JSON.parse(localStorage.getItem('loginResponse'));
    }else{
      if(toState.name!='home' && toState.name!='customerHome' && toState.name!='selectRegion' && toState.name!='merchantRegister'  && toState.name!='merchantDepositResponse' && toState.name!='commonMessage' && toState.name!='forgotPassword' && toState.name!='chat' && toState.name!='customerChatList' && toState.name!='gallery'){
        localStorage.setItem('loginResponse',null);
        localStorage.setItem('loginStatus',false);
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        if (toState.name !== 'merchantLogin') {
          $state.go('merchantLogin');
          event.preventDefault();
        }
      }
    }
    if(localStorage.getItem('deviceToken')!=undefined && localStorage.getItem('deviceToken')!='undefined' && localStorage.getItem('language')!=null){
      $rootScope.deviceToken = localStorage.getItem('deviceToken');
    }else{
      //registerPushNotification();
    }
    $ionicLoading.show({
      template: '<ion-spinner icon="bubbles"></ion-spinner>',
      // hideOnStateChange: true
    });
    //when the state changes all pending $http requests will be cancelled
    pendingRequests.cancelAll();
    //setting language and direction properties
    if(localStorage.getItem('language')!="undefined" && localStorage.getItem('language')!=null){
      $rootScope.language = localStorage.getItem('language');
    }else{
      $rootScope.language = 'en';
    }
  });

  $rootScope.$on('$stateChangeSuccess', function () {
    $ionicLoading.hide();
    //initializing user
  });

  $rootScope.$watch('language',function () {
    if($rootScope.language){
      localStorage.setItem('language', $rootScope.language);
      $scope.language = $rootScope.language;
      if($rootScope.language=='en'){
        $scope.directions = 'ltr-direction';
      }else{
        $scope.directions = 'rtl-direction';
      }
      $translate.use($scope.language);
    }
  });



  function registerPushNotification(){

    pushNotification = window.plugins.pushNotification;

    window.onNotification = function(e){
      switch(e.event){
        case 'registered':
          if(e.regid.length > 0){
            var device_token = e.regid;
            localStorage.setItem('deviceToken',device_token);
            // RequestsService.register(device_token).then(function(response){
            //   $cordovaToast.showShortBottom("registered for push notification!").then();
            // });
          }
          break;
        case 'message':
          break;
        case 'error':
          break;
      }
    };

    function pushMessageToLocalStorage (sender,e,next){
      var messages = {};
      var nextMessage = {
        messageType:'received',
        read:false,
        dateTime: dateFilter(new Date(),'yy-MMM-d hh:mm:ss a'),
        sender: {
          name: sender.senderName,
          profilePic: 'http://ionicframework.com/img/docs/barrett.jpg'
        },
        content: {
          type:'text',
          content: e.message
        }
      };
      if(localStorage.getItem(sender.senderType+'Messages')!=null){
        messages = JSON.parse(localStorage.getItem(sender.senderType+'Messages'));
      }
      if(!messages.hasOwnProperty(sender.senderCode)){
        messages[sender.senderCode] = {
          senderName:sender.senderName,
          messages:[]
        };
      }
      messages[sender.senderCode].messages.push(angular.extend({}, nextMessage));
      localStorage.setItem(sender.senderType+'Messages',JSON.stringify(messages));
      if(next!=''){
        next();
      }
    }
    // pushNotification = window.plugins.pushNotification;
    //
    // window.onNotification = function(e){
    //   switch(e.event){
    //     case 'registered':
    //       if(e.regid.length > 0){
    //         var device_token = e.regid;
    //         if(localStorage.getItem('deviceToken') == undefined || localStorage.getItem('deviceToken')!=device_token){
    //           localStorage.setItem('deviceToken',device_token);
    //         }
    //         $rootScope.deviceToken = localStorage.getItem('deviceToken');
    //         if(localStorage.getItem('loginStatus')){
    //           RequestsService.register(device_token).then(function(response){
    //             $cordovaToast.showShortBottom("registered for push notification!").then();
    //           });
    //         }
    //       }
    //       break;
    //     case 'message':
    //         var merchant = merchants[Math.floor(Math.random() * 3)]
    //         $rootScope.$emit("CallParentMethod", {merchant:merchant,sender:'Anne',message:e.message,date:dateFilter(new Date(),'yy-MMM-d hh:mm:ss a')});
    //         if(e.foreground){
    //           $cordovaNativeAudio.play('notification');
    //           if($state.current.name!='chat'){
    //             $rootScope.$emit("CallParentMethod", {merchant:merchant,sender:'Anne',message:e.message,date:dateFilter(new Date(),'yy-MMM-d hh:mm:ss a')});
    //             $ionicPopup.confirm({
    //               title: 'New Message From Anne',
    //               template: 'want to open chat window ?'
    //             }).then(function(res) {
    //               if(res) {
    //                 $state.go('chat',{sender:merchant});
    //               }
    //             });
    //           }
    //         }else{
    //           $state.go('chat',{sender:merchant});
    //         }
    //       break;
    //     case 'error':
    //       alert('error occured');
    //       break;
    //   }
    // };

    window.errorHandler = function(error){
      alert('an error occured');
    };

    pushNotification.register(
      onNotification,
      errorHandler,
      {
        'badge': 'true',
        'sound': 'true',
        'alert': 'true',
        'senderID': '111248462576',
        'ecb': 'onNotification'
      }
    );
  }

  function initAdds(){
    // console.log(localStorage.getItem('adds'));
    if(localStorage.getItem('adds')!=null && localStorage.getItem('adds')!='null' && localStorage.getItem('adds')!=undefined && localStorage.getItem('adds')!='undefined'){
      $scope.adds = JSON.parse(localStorage.getItem('adds'));
      $scope.visibleAdd = $scope.adds[Math.floor(Math.random() * $scope.adds.length)];
      //$scope.visibleAdd.image_url = 'https://www.buffalo.edu/content/www/ubit/service-guides/safe-computing/dmca/ub-compliance-with-heoa/copyright-awareness-campaign/_jcr_content/par/image_0.img.680.auto.jpg/1410359977952.jpg';
      // console.log(JSON.stringify($scope.visibleAdd));
    }else{
      var payLeService = serviceLocator.serviceList.PayLeService;
      var extended_url = '/merchant/getVisibleAd';
      httpService.getRequest(payLeService,extended_url,{}).then(function(response){
        localStorage.setItem('adds',JSON.stringify(response));
        // console.log(response);
      });
    }
  }
  function initAdds(){

  }
  $scope.openLink = function (url) {
    // console.log(url);
    window.open(url, '_system', 'location=yes');
    return false;
  }
})
.directive('payLeHeader', function($ionicHistory,$state,$filter) {
  return {
    restrict: 'AE',
    scope: {
      back:'=',
    },
    link: function (scope, elem, attrs) {
      //console.log(elem, attrs,scope.back);
      scope.myGoBack = function () {
        if(scope.back){
          $state.go(scope.back);
        }else{
          $ionicHistory.goBack();
        }
      }
    },
  //   <div>
  //   <a class="button button-icon row" ng-click="myGoBack()" style="
  // height: 50px;
  // "><img src="img/backButton.png" style="width:35px;">
  // </a>
  // <span class="row" style="
  // /* text-align: center; */
  // "> Back</span>
  // </div>
    template: '<ion-header-bar>'+
                  '<div class="bar bar-header bar-light custom-nav-bar" style="direction: ltr;">'+
                    '<div><a class="button button-icon row"  ng-click="myGoBack()"><img src="img/backButton.png" style="width:35px; height: 35px;"></a><span class="row" style="font-weight: 600; margin-left: 6px;">{{"BACK" | translate}}</span></div>'+
                    '<h1 class="title"></h1>'+
                    '<a class="button button-icon" href="#/home"><img src="img/payleLogo.png"  style="height:70px;"></a>'+
                  '</div>'+
              '</ion-header-bar>'
  };
})
.directive('compareTo',[function(){
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
}])
.directive('languageBar', function($rootScope) {
  return {
    restrict: 'AE',
    scope: {

    },
    link: function (scope) {
      scope.toggleLang = function (lang) {
        $rootScope.language = lang;
      }
    },
    template:'<div class="bar bar-custom-subheader">'+
                '<div class="row display-inline" style="text-align:right;direction:ltr">'+
                '<a class="button button-clear button-positive language-buttons" ng-class="language==\'en\'?\'language-selected\':\'\'" ng-click="toggleLang(\'en\')">'+
                '<img src="img/en.png" class="full-height" style="padding:0px 2px 0px 2px !important">'+
                '</a>'+
                '<a class="button button-clear button-positive language-buttons" ng-class="language==\'ar\'?\'language-selected\':\'\'" ng-click="toggleLang(\'ar\')">'+
                '<img src="img/ar.png" class="full-height" style="padding:0px 2px 0px 2px !important">'+
                '</a>'+
                '</div>'+
            '</div>'
  };
})
.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;

      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}])
.directive('merchantAvailable', function(serviceLocator,httpService,$timeout, $q) {
  return {
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope, elm, attr, model) {
      model.$asyncValidators.merchantExists = function(modalValue) {
          var payLeService = serviceLocator.serviceList.PayLeService;
          var extended_url = '/merchant/getMerchantAvailability/'+modalValue;
          var defer = $q.defer();
          httpService.getRequest(payLeService,extended_url,{}).then(function(response){
            if(response.errorMessage!=null){ // make errorCode -> errorMessage
              model.$setValidity('merchantExists', false);
              scope.merchantCurrencyCode = null;
            }else{
              model.$setValidity('merchantExists', true);
              scope.merchantCurrencyCode = response.currencyCode;
              //to initiate chat
              scope.sender = {
                senderCode : response.merchantCode,
                senderName : response.merchantName,
                senderEmail : response.merchantEmail
              };
            }
            defer.resolve;
          });
          return defer.promise;

      };
    }
  }
})
.service('fileUpload', ['$http', function ($http) {
  this.uploadFileToUrl = function(file, uploadUrl){
    var fd = new FormData();
    fd.append('file', file);

    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type':'multipart/form-data',
        'merchant':'4579883696125',
        'side':'B'}
    })

      .success(function(){
      })

      .error(function(){
      });
  }
}])
// This service keeps track of pending requests
.service('pendingRequests', function() {
  var pending = [];
  this.get = function() {
    return pending;
  };
  this.add = function(request) {
    pending.push(request);
  };
  this.remove = function(request) {
    pending = _.filter(pending, function(p) {
      return p.url !== request;
    });
  };
  this.cancelAll = function() {
    angular.forEach(pending, function(p) {
      p.canceller.resolve();
    });
    pending.length = 0;
  };
});





