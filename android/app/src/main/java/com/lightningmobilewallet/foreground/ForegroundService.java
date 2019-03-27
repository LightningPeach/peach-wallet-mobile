package com.lightningmobilewallet.foreground;

import android.annotation.TargetApi;
import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.IBinder;
import android.support.annotation.Nullable;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.NotificationManagerCompat;

import com.lightningmobilewallet.R;

import static android.app.PendingIntent.FLAG_CANCEL_CURRENT;

public class ForegroundService extends Service {

    private static final String NOTIFICATION_CHANNEL_ID = "foreground";
    private static final String EXTRA_MESSAGE = "message";
    private static final int NOTIFICATION_ID = 1002;

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String message = intent.getStringExtra(EXTRA_MESSAGE);
        startForeground(NOTIFICATION_ID, createNotification(message));
        return START_REDELIVER_INTENT;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private Notification createNotification(String message) {
        NotificationCompat.Builder builder = getNotificationBuilder(this, NOTIFICATION_CHANNEL_ID, NotificationManagerCompat.IMPORTANCE_LOW);
        // Make notification show big text.
        NotificationCompat.BigTextStyle bigTextStyle = new NotificationCompat.BigTextStyle()
                .setBigContentTitle(getString(R.string.foregrond_service_notification_title))
                .bigText(message);
        // Set big text style.
        builder.setStyle(bigTextStyle)
                .setContentTitle(getString(R.string.foregrond_service_notification_title))
                .setContentText(message)
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher))
                .setWhen(System.currentTimeMillis());
        PackageManager pm = getApplicationContext().getPackageManager();
        Intent startIntent = pm.getLaunchIntentForPackage(getApplicationContext().getPackageName());
        PendingIntent contentIntent = PendingIntent.getActivity(this, 1000, startIntent, FLAG_CANCEL_CURRENT);
        builder.setContentIntent(contentIntent);
        return builder.build();
    }


    public static NotificationCompat.Builder getNotificationBuilder(Context context, String channelId, int importance) {
        NotificationCompat.Builder builder;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            prepareChannel(context, channelId, importance);
            builder = new NotificationCompat.Builder(context, channelId);
        } else {
            builder = new NotificationCompat.Builder(context);
        }
        return builder;
    }

    @TargetApi(26)
    private static void prepareChannel(Context context, String id, int importance) {
        final String appName = context.getString(R.string.app_name);
        String description = context.getString(R.string.app_name);
        final NotificationManager nm = (NotificationManager) context.getSystemService(Activity.NOTIFICATION_SERVICE);

        if (nm != null) {
            NotificationChannel nChannel = nm.getNotificationChannel(id);
            if (nChannel == null) {
                nChannel = new NotificationChannel(id, appName, importance);
                nChannel.setDescription(description);
                nm.createNotificationChannel(nChannel);
            }
        }
    }

    public static Intent getIntent(Context context, String message) {
        Intent intent = new Intent(context, ForegroundService.class);
        intent.putExtra(EXTRA_MESSAGE, message);
        return intent;
    }
}
