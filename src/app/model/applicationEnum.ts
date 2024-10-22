export enum otpPageEnum {
    registration=1, 
    verification=2,
    login=3
  }

  export enum applicationObject {
    mobileDetails="mobileDetails", 
    token="token",
    loginUserDetails="loginUserDetails",
    isFirstTimeSliderhOpenApp="isFirstTimeSliderhOpenApp",
    FCM_TOKEN="push_notification_token",
    language="language",
    resourceData="resourceData"
  }

  export enum statusEnum {
    Pending=1, 
    Active=2, 
    Completed=3, 
    Closed=4
  }

export enum responseEnum{
    success=1,
    fail=2
}