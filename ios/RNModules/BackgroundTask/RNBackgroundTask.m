@import UIKit;
@import UserNotifications;
#import "RNBackgroundTask.h"

@implementation RNBackgroundTask {
  NSMutableDictionary* bgTasks;
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

RCT_EXPORT_MODULE(RNBackgroundTaskIOS)

- (instancetype)init
{
  self = [super init];
  if (self)
  {
    bgTasks = [NSMutableDictionary new];
  }
  
  return self;
}


RCT_EXPORT_METHOD(start:(NSString *)name callback:(RCTResponseSenderBlock) callback)
{
  __block UIBackgroundTaskIdentifier bgTask = [[UIApplication sharedApplication] beginBackgroundTaskWithName:name expirationHandler:^{
    // Clean up any unfinished task business by marking where you
    // stopped or ending the task outright.
    callback([NSArray array]);
    [[UIApplication sharedApplication] endBackgroundTask:bgTask];
    [bgTasks removeObjectForKey:name];
  }];
  
  [bgTasks setObject:[NSNumber numberWithUnsignedLong:bgTask] forKey:name];
}

RCT_EXPORT_METHOD(stop:(NSString *)name)
{
  NSNumber* bgTask = [bgTasks objectForKey:name];
  if (bgTask != nil) {
    [[UIApplication sharedApplication] endBackgroundTask:[bgTask unsignedLongValue]];
    [bgTasks removeObjectForKey:name];
  }
  
}
@end

