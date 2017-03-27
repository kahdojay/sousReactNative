/**
 * Copyright (c) 2015-present, Sous Inc.
 * All rights reserved.
 *
 */

#import "RemotePushDelegate.h"
#import "AppDelegate.h"
#import "RCTRootView.h"
#import <asl.h>
#import "RCTLog.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  
  //Add the following lines
//  RCTSetLogThreshold(RCTLogLevelInfo - 1);
  RCTSetLogFunction(SousReactLogFunction);

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

 //jsCodeLocation = [NSURL URLWithString:@"http://localhost:8080/index.ios.bundle?platform=ios&dev=true"];

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

//  NSNumber *yourNumber = [NSNumber numberWithInt:1];
//  SousReactLogFunction(RCTLogLevelError, @"main.jsbundle", yourNumber, @"Error occurred!");
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void) applicationWillEnterForeground:(UIApplication *)application
{
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (void)applicationDidFinishLaunching:(UIApplication *)application
{
  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (id) init {
  return self;
}

RCTLogFunction SousReactLogFunction = ^(
  RCTLogLevel level,
  NSString *fileName,
  NSNumber *lineNumber,
  NSString *message
)
{
  NSString *log = RCTFormatLog(
    [NSDate date], level, fileName, lineNumber, message
  );
    
  #ifdef DEBUG
    fprintf(stderr, "%s\n", log.UTF8String);
    fflush(stderr);
  #else
    NSString *jsonString = [NSString stringWithFormat:@"{\"username\": \"Crabylicts\",\"channel\": \"#dev-errors\",\"text\": \"REACT LOG: %s\",\"icon_emoji\": \":crab:\"}", log.UTF8String];
    NSData *jsonData = [jsonString dataUsingEncoding:NSUTF8StringEncoding];

    NSURL *projectsUrl = [NSURL URLWithString:@"https://hooks.slack.com/services/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"];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:projectsUrl cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30.0];
    [request setHTTPMethod:@"POST"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setValue:[NSString stringWithFormat:@"%lu", (unsigned long)[jsonData length]] forHTTPHeaderField:@"Content-Length"];
    [request setHTTPBody: jsonData];
  
    NSURLConnection *connection = [[NSURLConnection alloc] initWithRequest:request delegate:NULL];
  #endif
  
  int aslLevel = ASL_LEVEL_ERR;
  switch(level) {
    case RCTLogLevelInfo:
      aslLevel = ASL_LEVEL_NOTICE;
      break;
    case RCTLogLevelWarning:
      aslLevel = ASL_LEVEL_WARNING;
      break;
    case RCTLogLevelError:
      aslLevel = ASL_LEVEL_ERR;
      break;
    case RCTLogLevelMustFix:
      aslLevel = ASL_LEVEL_EMERG;
      break;
    default:
      aslLevel = ASL_LEVEL_DEBUG;
  }
  asl_log(NULL, NULL, aslLevel, "%s", message.UTF8String);
};

@end
