package com.lightningmobilewallet;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.facebook.react.ReactApplication;
import net.rhogan.rnsecurerandom.RNSecureRandomPackage;
import community.revteltech.nfc.NfcManagerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.lightningmobilewallet.foreground.ForegroundServiceBridgePackage;
import com.localz.PinchPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.reactlibrary.securekeystore.RNSecureKeyStorePackage;

import org.devio.rn.splashscreen.SplashScreenReactPackage;
import org.reactnative.camera.RNCameraPackage;

import java.util.Arrays;
import java.util.List;

import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.realm.react.RealmReactPackage;


public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.asList(new MainReactPackage(),
            new RNSecureRandomPackage(),
            new NfcManagerPackage(),
                    new RNFirebasePackage(),
                    new RNFirebaseAnalyticsPackage(),
                    new ForegroundServiceBridgePackage(),
                    new ReactNativePushNotificationPackage(),
                    new RNSecureKeyStorePackage(),
                    new RealmReactPackage(),
                    new VectorIconsPackage(),
                    new RNUUIDGeneratorPackage(),
                    new SplashScreenReactPackage(),
                    new PinchPackage(),
                    new LinearGradientPackage(),
                    new ReactNativeConfigPackage(),
                    new RNCameraPackage(),
                    new BackgroundTimerPackage());
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        if (BuildConfig.DEBUG) {

            StethoWrapper.initialize(this);
            StethoWrapper.addInterceptor();
        }

        SoLoader.init(this, /* native exopackage */ false);
    }
}
