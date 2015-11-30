/**
 * Copyright (c) 2015-present, Sous Inc.
 * All rights reserved.
 *
 */

#import "RCTPushNotificationManager.h"
#import <Parse/Parse.h>

#import "AppDelegate.h"

#import "RCTRootView.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [Parse setApplicationId:@"vFE70wypvE813z5p1xYUrujFGkDFcUuXGcteBUyY"
                clientKey:@"aycVD5jS9U2FJ2mJzcKCdcr2TpJ5DgVYpwQI4HNg"];
  
  // Register for Push Notitications
  UIUserNotificationType userNotificationTypes = (UIUserNotificationTypeAlert |
                                                  UIUserNotificationTypeBadge |
                                                  UIUserNotificationTypeSound);
  UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:userNotificationTypes
                                                                           categories:nil];
  [application registerUserNotificationSettings:settings];
  [application registerForRemoteNotifications];
//
  NSURL *jsCodeLocation;

  /**
   * Loading JavaScript code - uncomment the one you want.
   *
   * OPTION 1
   * Load from development server. Start the server from the repository root:
   *
   * $ npm start
   *
   * To run on device, change `localhost` to the IP address of your computer
   * (you can get this by typing `ifconfig` into the terminal and selecting the
   * `inet` value under `en0:`) and make sure your computer and iOS device are
   * on the same Wi-Fi network.
   */

// jsCodeLocation = [NSURL URLWithString:@"http://localhost:8080/index.ios.bundle?platform=ios&dev=true"];

  /**
   * OPTION 2
   * Load from pre-bundled file on disk. To re-generate the static bundle
   * from the root of your project directory, run
   *
   * $ react-native bundle --minify
   *
   * see http://facebook.github.io/react-native/docs/runningondevice.html
   */

    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"sousmobile"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

//- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
//  // Store the deviceToken in the current installation and save it to Parse.
//  PFInstallation *currentInstallation = [PFInstallation currentInstallation];
//  [currentInstallation setDeviceTokenFromData:deviceToken];
//  [currentInstallation saveInBackground];
//}
//
//- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {
//  [PFPush handlePush:userInfo];
//}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    [RCTPushNotificationManager application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
    [RCTPushNotificationManager application:application didReceiveRemoteNotification:notification];
}
@end
