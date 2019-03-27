//
//  RNNativeFetch.m
//  medipass
//
//  Created by Paul Wong on 13/10/16.
//  Copyright © 2016 Localz. All rights reserved.
//

#import "RNPinch.h"
#import "RCTBridge.h"

@interface RNPinchException : NSException
@end
@implementation RNPinchException
@end

// private delegate for verifying certs
@interface NSURLSessionSSLPinningDelegate:NSObject <NSURLSessionDelegate>

- (id)initWithCertNames:(NSArray<NSString *> *)certNames;

@property (nonatomic, strong) NSArray<NSString *> *certNames;

@end

@implementation NSURLSessionSSLPinningDelegate

- (id)initWithCertNames:(NSArray<NSString *> *)certNames {
    if (self = [super init]) {
        _certNames = certNames;
    }
    return self;
}

//
// Pinned cer as Text, not from File
//

- (NSArray *)pinnedCertificateData {
    NSMutableArray *localCertData = [NSMutableArray array];

    for (NSString* certName in self.certNames) {
        if (certName == nil) {
            @throw [[RNPinchException alloc]
                    initWithName:@"CertificateError"
                    reason:@"Can not load certicate given, check it's in the app resources."
                    userInfo:nil];
        }

        // Convert string to HEX
        NSString *command = [certName stringByReplacingOccurrencesOfString:@" " withString:@""];
        NSMutableData *commandToSend= [[NSMutableData alloc] init];
        unsigned char whole_byte;
        char byte_chars[3] = {'\0','\0','\0'};
        int i;

        for (i=0; i < [command length]/2; i++) {
            byte_chars[0] = [command characterAtIndex:i*2];
            byte_chars[1] = [command characterAtIndex:i*2+1];
            whole_byte = strtol(byte_chars, NULL, 16);
            [commandToSend appendBytes:&whole_byte length:1];
        }

        [localCertData addObject:commandToSend];
    }

    NSMutableArray *pinnedCertificates = [NSMutableArray array];
    for (NSData *certificateData in localCertData) {
        SecCertificateRef cer = SecCertificateCreateWithData(NULL, (__bridge CFDataRef)certificateData);
        
        if (cer != nil) {
            [pinnedCertificates addObject:(__bridge_transfer id) cer];
        }
    }
    return pinnedCertificates;
}

//
// ORIGIN
//

//- (NSArray *)pinnedCertificateData {
//    NSMutableArray *localCertData = [NSMutableArray array];
//    for (NSString* certName in self.certNames) {
//        NSString *cerPath = [[NSBundle mainBundle] pathForResource:certName ofType:@"cer"];
//        if (cerPath == nil) {
//            @throw [[RNPinchException alloc]
//                initWithName:@"CertificateError"
//                reason:@"Can not load certicate given, check it's in the app resources."
//                userInfo:nil];
//        }
//        [localCertData addObject:[NSData dataWithContentsOfFile:cerPath]];
//    }
//
//    NSMutableArray *pinnedCertificates = [NSMutableArray array];
//    for (NSData *certificateData in localCertData) {
//        SecCertificateRef cer = SecCertificateCreateWithData(NULL, (__bridge CFDataRef)certificateData);
//        [pinnedCertificates addObject:(__bridge_transfer id) cer];
//    }
//    return pinnedCertificates;
//}

- (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition disposition, NSURLCredential * _Nullable credential))completionHandler {

    if ([[[challenge protectionSpace] authenticationMethod] isEqualToString:NSURLAuthenticationMethodServerTrust]) {
        SecTrustRef serverTrust = [[challenge protectionSpace] serverTrust];

        // setup
        SecTrustSetAnchorCertificates(serverTrust, (__bridge CFArrayRef)self.pinnedCertificateData);
        SecTrustResultType result;

        // evaluate
        OSStatus errorCode = SecTrustEvaluate(serverTrust, &result);

        BOOL evaluatesAsTrusted = (result == kSecTrustResultUnspecified || result == kSecTrustResultProceed);
        if (errorCode == errSecSuccess && evaluatesAsTrusted) {
            NSURLCredential *credential = [NSURLCredential credentialForTrust:serverTrust];
            completionHandler(NSURLSessionAuthChallengeUseCredential, credential);
        } else {
            completionHandler(NSURLSessionAuthChallengeRejectProtectionSpace, NULL);
        }
    } else {
        completionHandler(NSURLSessionAuthChallengePerformDefaultHandling, NULL);
    }
}

@end

@interface RNPinch()

@property (nonatomic, strong) NSURLSessionConfiguration *sessionConfig;

@end

@implementation RNPinch
RCT_EXPORT_MODULE();

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.sessionConfig = [NSURLSessionConfiguration ephemeralSessionConfiguration];
        self.sessionConfig.HTTPCookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    }
    return self;
}

+(BOOL)requiresMainQueueSetup {
    return NO;
}

RCT_EXPORT_METHOD(fetch:(NSString *)url obj:(NSDictionary *)obj callback:(RCTResponseSenderBlock)callback) {
    NSURL *u = [NSURL URLWithString:url];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:u];

    NSURLSession *session;
    if (obj) {
        if (obj[@"method"]) {
            [request setHTTPMethod:obj[@"method"]];
        }
        if (obj[@"timeoutInterval"]) {
          [request setTimeoutInterval:[obj[@"timeoutInterval"] doubleValue] / 1000];
        }
        if (obj[@"headers"] && [obj[@"headers"] isKindOfClass:[NSDictionary class]]) {
            NSMutableDictionary *m = [obj[@"headers"] mutableCopy];
            for (NSString *key in [m allKeys]) {
                if (![m[key] isKindOfClass:[NSString class]]) {
                    m[key] = [m[key] stringValue];
                }
            }
            [request setAllHTTPHeaderFields:m];
        }
        if (obj[@"body"]) {
            NSData *data = [obj[@"body"] dataUsingEncoding:NSUTF8StringEncoding];
            [request setHTTPBody:data];
        }
    }
    if (obj && obj[@"sslPinning"] && obj[@"sslPinning"][@"cert"]) {
        NSURLSessionSSLPinningDelegate *delegate = [[NSURLSessionSSLPinningDelegate alloc] initWithCertNames:@[obj[@"sslPinning"][@"cert"]]];
        session = [NSURLSession sessionWithConfiguration:self.sessionConfig delegate:delegate delegateQueue:[NSOperationQueue mainQueue]];
    } else if (obj && obj[@"sslPinning"] && obj[@"sslPinning"][@"certs"]) {
        // load all certs
        NSURLSessionSSLPinningDelegate *delegate = [[NSURLSessionSSLPinningDelegate alloc] initWithCertNames:obj[@"sslPinning"][@"certs"]];
        session = [NSURLSession sessionWithConfiguration:self.sessionConfig delegate:delegate delegateQueue:[NSOperationQueue mainQueue]];
    } else {
        session = [NSURLSession sessionWithConfiguration:self.sessionConfig];
    }

    __block NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            dispatch_async(dispatch_get_main_queue(), ^{
                NSHTTPURLResponse *httpResp = (NSHTTPURLResponse*) response;
                NSInteger statusCode = httpResp.statusCode;
                NSString *bodyString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                NSString *statusText = [NSHTTPURLResponse localizedStringForStatusCode:httpResp.statusCode];

                NSDictionary *res = @{
                                      @"status": @(statusCode),
                                      @"headers": httpResp.allHeaderFields,
                                      @"bodyString": bodyString,
                                      @"statusText": statusText
                                      };
                callback(@[[NSNull null], res]);
            });
        } else {
            dispatch_async(dispatch_get_main_queue(), ^{
                callback(@[@{@"message":error.localizedDescription}, [NSNull null]]);
            });
        }
    }];

    [dataTask resume];
}

@end
