package com.lightningmobilewallet;

import android.content.Context;

import com.facebook.react.modules.network.OkHttpClientFactory;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.stetho.Stetho;
import com.facebook.stetho.okhttp3.StethoInterceptor;

import okhttp3.OkHttpClient;

public class StethoWrapper {

    private  StethoWrapper() {
        throw new IllegalStateException("Utility class");
    }

    public static void initialize(Context context) {
        Stetho.initializeWithDefaults(context);
    }

    public static void addInterceptor() {
        final OkHttpClient baseClient = OkHttpClientProvider.createClient();
        OkHttpClientProvider.setOkHttpClientFactory(new OkHttpClientFactory() {
            @Override
            public OkHttpClient createNewNetworkModuleClient() {
                return baseClient.newBuilder()
                        .addNetworkInterceptor(new StethoInterceptor())
                        .build();
            }
        });
    }
}