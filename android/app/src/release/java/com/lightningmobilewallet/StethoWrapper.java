package com.lightningmobilewallet;

import android.content.Context;

public class StethoWrapper {

    private  StethoWrapper() {
        throw new IllegalStateException("Utility class");
    }
    
    public static void initialize(Context context) {
        // NO_OP
    }

    public static void addInterceptor() {
        // NO_OP
    }
}