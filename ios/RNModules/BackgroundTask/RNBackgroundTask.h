
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

@interface RNBackgroundTask : NSObject <RCTBridgeModule>

@end

void requestUserPermissionForNotification();
void showLocalNotification();
