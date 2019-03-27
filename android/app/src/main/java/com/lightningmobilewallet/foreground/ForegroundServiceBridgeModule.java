package com.lightningmobilewallet.foreground;


import android.content.Intent;
import android.os.Build;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class ForegroundServiceBridgeModule extends ReactContextBaseJavaModule {

    public ForegroundServiceBridgeModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "ForegroundServiceAndroid";
    }

    @ReactMethod
    public void start(String message) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getReactApplicationContext().startForegroundService(ForegroundService.getIntent(getReactApplicationContext(), message));
        } else {
            getReactApplicationContext().startService(ForegroundService.getIntent(getReactApplicationContext(), message));
        }
        HeadlessJsTaskService.acquireWakeLockNow(getReactApplicationContext());
    }

    @ReactMethod
    public void stop() {
        this.getReactApplicationContext().stopService(new Intent(getReactApplicationContext(), ForegroundService.class));
    }
}