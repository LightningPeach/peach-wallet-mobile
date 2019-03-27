package com.lightningmobilewallet;

import android.app.Dialog;
import android.app.DialogFragment;
import android.app.FragmentManager;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
    private static final int PLAY_SERVICES_RESOLUTION_REQUEST = 9001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);

        checkPlayServices();
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "LightningMobileApp";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PLAY_SERVICES_RESOLUTION_REQUEST && resultCode != RESULT_OK) {
            finish();
        }
    }

    /**
     * Check the device to make sure it has the Google Play Services APK. If
     * it doesn't, display a dialog that allows users to download the APK from
     * the Google Play Store or enable it in the device's system settings.
     */
    private void checkPlayServices() {
        GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
        int resultCode = apiAvailability.isGooglePlayServicesAvailable(this);
        if (resultCode != ConnectionResult.SUCCESS) {
            if (apiAvailability.isUserResolvableError(resultCode)) {
                ErrorDialogFragment.show(getFragmentManager(), resultCode);
            } else {
                finish();
            }
        }
    }

    public static class ErrorDialogFragment extends DialogFragment {
        private static final String ERROR_ARG = "error";


        @Override
        public Dialog onCreateDialog(Bundle savedInstanceState) {
            int errorCode = getArguments().getInt(ERROR_ARG);
            return GoogleApiAvailability.getInstance().getErrorDialog(
                    getActivity(),
                    errorCode,
                    PLAY_SERVICES_RESOLUTION_REQUEST
            );
        }

        @Override
        public void onDismiss(DialogInterface dialog) {
            getActivity().finish();
        }

        public static void show(FragmentManager fragmentManager, int errorCode) {
            ErrorDialogFragment dialogFragment = new ErrorDialogFragment();

            Bundle args = new Bundle();
            args.putInt(ERROR_ARG, errorCode);
            dialogFragment.setArguments(args);
            dialogFragment.show(fragmentManager, "errordialog");
        }
    }
}
