/**
 * Created by SudeshNT on 11/4/2016.
 */
angular.module('lang_en',['pascalprecht.translate','ngSanitize'])
  .config(['$translateProvider',function($translateProvider){
    $translateProvider.translations('en', {
      LANGUAGE:'العربية',
      BACK:'Back',
      //main menu
      CUSTOMERS:'Customers',
      MERCHANTS:'Payle Clients',
      CUSTOMER:'Customer',
      MERCHANT:'Payle Client',
      TRANSACTIONS:'Transactions',
      PROFILE:'Profile',
      MESSAGES:'Messages',
      MEDIA:'Media',
      FEES:'Fees',
      CIVIL_ID:'Civil ID',
      PAYMENT_URL:'Payment URL',
      ABOUT_US:'About US',
      LOGOUT:'Logout',
      LOGIN:'Login',
      REGISTER:'Register',
      FORGOT_PASSWORD:'Forgot Password?',
      GALLERY:'Gallery',
      // sub menus
      ALL:'All',
      WITHDRAWALS:'Withdrawals',
      REQUEST_WITHDRAWALS:'Request Withdraw',
      EDIT_PROFILE:'Edit Profile',
      CHANGE_PASSWORD:'Change Password',
      //balance bar
      ACTUAL:'actual',
      ON_HOLD:'on hold',
      CURRENT:'current',

      CONFIRM_PASSWORD:'Confirm Password',
      PASSWORD:'Password',
      SHOW_PASSWORD:'Show Password',
      ENTER_PASSWORD:'Enter Password',
      USERNAME:'Username',

      //REGISTRATION
      NAME:'Name',
      BUSINESS_NAME:'Business Name',
      BANK:'Bank',
      REGION:'Region',
      ACCOUNT_NUMBER:'Account Number',
      IBAN:'IBAN',
      MOBILE:'Mobile',
      EMAIL:'Email',
      DATE_OF_BIRTH:'Date of Birth',
      OPTIONAL:'optional',
      SHARE_SOCIAL:'Share Social Accounts',
      ACCOUNT_NAME:'Type Account Name',
      SOCIAL_ACCOUNTS:'Social Accounts',
      CURRENCY:'Currency',
      //customer payment
      MERCHANT_CODE:'Merchant Code',
      AMOUNT:'Amount',
      FULL_AMOUNT:'Full Amount',
      CUSTOMER_MOBILE:'Customer Mobile',
      CUSTOMER_EMAIL:'Customer Email',
      CARD_TYPE:'Card Type',
      COMMENTS:'Comments',
      NEXT:'Next',
      START_CHAT_WITH_MERCHANT:'start chat with a merchant',
      //change password
      CURRENT_PASSWORD:'Current Password',
      NEW_PASSWORD:'New Password',
      CONFIRM_NEW_PASSWORD:'Confirm New Password',
      CONFIRM_MUST_MATCH:'Must Match with Password',

      //transactions
      SUCCESSFUL:'Successful',
      PENDING:'Pending',
      REJECTED:'Rejected',
      DATE:'Date',
      STATUS:'Status',
      APPROVED_DATE:'Approval Date',
      EXTERNAL_REF:'External Reference',

      //civil ID page
      FRONT_SIDE:'Front Side',
      BACK_SIDE:'Back Side',
      EXPIRY_DATE:'Expiry Date',
      SELECT_EXPIRY_DATE:'Select Expiry Date',
      VALIDATE_ID:'Validate ID',
      INSERT_BOTH_SIDES_OF_ID:'please insert both sides of the ID',
      ID_VALIDATION_SUCCESSFUL:'ID Successfully Validated!',

      //withdraw request
      REQUEST_WITHDRAW : 'Request Withdraw',
      ACTUAL_BALANCE : 'Actual Balance',
      BANK_ACCOUNT:'Bank Account',

      //payment url
      SHARE_WITH:'Share With',
      CREATE_BILL:'Create Bill',
      PAYMENT_METHOD:'Payment Method',
      COPY_TO_CLIPBOARD:'copy to clipboard',
      //forgot password
      REQUEST_FORGOT_INFO : 'Enter your email address that you used to register. We will send you an email with your username and a link to reset your password.',
      SUBMIT : 'Submit',

      //transaction details popup
      BUYER_MOBILE:'Buyer Mobile',
      TRANSACTION_DATE:'Transaction Date',
      FEE:'Fee',

      //commissions
      FLAT:'Flat',
      PERCENTAGE:'Percentage',

      //toasts
      THATS_ALL_SUCCESSFUL_TRANSACTIONS : "That's all Successful Transactions",
      THATS_ALL_REJECTED_TRANSACTIONS : "That's all Rejected Transactions",
      THATS_ALL_SUCCESSFUL_WITHDRAWALS : "That's all Successful Withdrawals",
      THATS_ALL_REJECTED_WITHDRAWALS : "That's all Rejected Withdrawals",
      THATS_ALL_PENDING_WITHDRAWALS : "That's all Pending Withdrawals",
      IMAGE_UPLOAD_SUCCESSFUL:'Image uploaded successfully!',
      IMAGE_UPLOAD_UNSUCCESSFUL:'Image upload unsuccessful!',
      CONNECTION_ERROR:'Connection Error!',
      ERROR:'Error',
      SERVER_ERROR:'Server Error',

      // gallery image upload
      UPLOAD_NEW_IMAGE : 'Upload New Image',

      // new
      CHAT_WITH_MERCHANT : 'Chat With Merchant',
      ID_APPROVAL_NOT_SUBMITTED : 'id not submitted for approval',
      ID_APPROVAL_PENDING : 'id approval is pending',
      ID_APPROVAL_SUCCESSFUL : 'id approval is successful',
      ID_APPROVAL_REJECTED : 'id approval is rejected',
      DEFAULT_URL : 'Default URL',
      DEFAULT_PAYMENT_URL : 'Default Payment URL',
      MERCHANT_DOES_NOT_EXIST:"merchant doesn't exist",
      CHECKING:"checking",

      AVAILABLE:'available',
      START_CHAT:'start chat',

      YOUR_NAME:'your name',
      FIRST_NAME:'First Name',
      MERCHANT_EMAIL:"merchant's email",
      ENTER_VALID_EMAIL:'enter valid email',
      DOES_NOT_MATCH_WITH_MERCHANT_EMAIL:"doesn't match with merchant email",

      COPIED_TO_CLIPBOARD:'copied to clipboard',
      ERROR_WHILE_COPYING:'There was an error copying',
      NEW_MESSAGE_FROM : 'New Message From ',
      WANT_TO_OPEN_CHAT_WINDOW:'want to open chat window ?',
      TRANSACTION :'Transaction',
      CANCEL : 'Cancel',
      WITHDRAW_REQUEST_SENT : 'withdraw request Sent',

      PAYMENT_SUCCESSFUL:'Payment Successful',
      REGISTRATION_SUCCESSFUL : 'Registration Successful',
      LOGIN_WITH_MERCHANT_CODE:'Login with merchant code',
      PROFILE_SUCCESSFULLY_EDITED:'Profile Successfully Edited',
      GO_BACK_TO_MAIN_MENU:'go back to main menu',
      PASSWORD_SUCCESSFULLY_CHANGED:'Password Successfully Changed',
      PASSWORD_RESET_SUCCESSFUL:'Password Reset Successful',
      LOGIN_EMAIL_SENT:'Email sent with new login details.',

      //NEW
      FIRST_SECOND_AND_LAST:'First Second & Last Name',
      SELECT_REGION:'Select Your Region',
      MIDDLE_NAME:'Middle Name',
      LAST_NAME:'Last Name',
      ID_SUBMIT_SUCCESSFUL:'ID Successfully Submitted!',

      INVALID_EMAIL : 'invalid email address',

    });
    //$translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
    //$translateProvider.forceAsyncReload(true);

  }]);
