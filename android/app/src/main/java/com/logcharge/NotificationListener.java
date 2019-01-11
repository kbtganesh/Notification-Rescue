package com.logcharge;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Base64;
import android.util.Log;

import java.io.ByteArrayOutputStream;
public class NotificationListener extends NotificationListenerService {

    Context context;

    private String TAG = this.getClass().getSimpleName();
    public static final String NOTIFICATION_FOREGROUND_KBT = "NOTIFICATION_FOREGROUND_KBT";
    private static int foreground_notification_id = 1;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("KBTCHECK", "NotificationListener - onCreate");
        context = getApplicationContext();
    }
//
//    @Override
//    public IBinder onBind(Intent intent) {
//        Log.d("KBT-Bind", "FROM LISTENER ONBIND");
//        return super.onBind(intent);
//    }
//
//    @Override
//    public void onDestroy() {
//        super.onDestroy();
//    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.d("KBTCHECK", "NotificationListener - onStartCommand");

//        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
//
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            NotificationChannel chan1 = new NotificationChannel(
//                    "notification_channel_id",
//                    "default",
//                    NotificationManager.IMPORTANCE_HIGH);
//
//            chan1.setLightColor(Color.TRANSPARENT);
//            chan1.setLockscreenVisibility(Notification.VISIBILITY_SECRET);
//
//            notificationManager.createNotificationChannel(chan1);
//        }
//        startForeground(foreground_notification_id, getCompatNotification());
        return START_STICKY;
    }

    @Override
    public void onListenerConnected() {
        super.onListenerConnected();
        Log.d("KBTCHECK", "NotificationListener - onListenerConnected");
//        Log.d(TAG, "Service Reader Connected");
//        Notification not = createNotification();
//        NotificationManager mNotificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
//        if (mNotificationManager != null) {
//            mNotificationManager.notify(NOTIFICATION_ID, not);
//        }
//
//        startForeground(NOTIFICATION_ID, not);
    }
    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {

        Log.d("KBTCHECK", "NotificationListener - onNotificationPosted");
        if(!sbn.isOngoing()){
            Log.d("KBTCHECK", "NotificationListener - onNotificationPosted - Not Ongoing Notification");
            String packageName = sbn.getPackageName();
            String key = sbn.getKey();
            PackageManager packageManager= getApplicationContext().getPackageManager();
            ApplicationInfo ai;
            try {
                ai = packageManager.getApplicationInfo( packageName, 0);
            } catch (final PackageManager.NameNotFoundException e) {
                ai = null;
            }
            final String appName = (String) (ai != null ? packageManager.getApplicationLabel(ai) : "(unknown)");

            Notification notification = sbn.getNotification();
            String ticker ="";
            if(sbn.getNotification().tickerText !=null) {
                ticker = sbn.getNotification().tickerText.toString();
            }
            Bundle extras = sbn.getNotification().extras;
            extras.putString("ticker", ticker);
            extras.putString("key", key);
            extras.putString("packageName", packageName);
            extras.putString("appName", appName);
            extras.putString("timeStamp", Long.toString(notification.when));
//        String title = extras.getString("android.title");
//
//
//        Log.d("KBT", "pack" +pack);
//        Log.d("KBT",ticker);
//        Log.d("KBT",title);
            Log.d("KBTCHECK", "NotificationListener - onNotificationPosted - AppName" + appName);


            Intent msgrcv = new Intent("NOTIFICATION_POSTED_KBT");
            msgrcv.putExtras(extras);

            LocalBroadcastManager.getInstance(context).sendBroadcast(msgrcv);
        }
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        sendBroadcast(new Intent("YouWillNeverKillMe"));
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        Log.d("KBTCHECK", "NotificationListener - onNotificationRemoved - NotiID" + sbn.getId());
    }

    private Notification getCompatNotification() {
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "notification_channel_id");
        String str = "is capturing your notifications";
        builder
                .setSmallIcon(R.mipmap.ic_launcher)
                .setLargeIcon(BitmapFactory.decodeResource(getResources(), R.mipmap.ic_launcher))
                .setContentTitle("Rescue Notification")
                .setContentText(str)
                .setTicker(str)
                .setWhen(System.currentTimeMillis());
        Intent startIntent = new Intent(getApplicationContext(), MainActivity.class);
        PendingIntent contentIntent = PendingIntent.getActivity(this, 1000, startIntent, 0);
        builder.setContentIntent(contentIntent);
        return builder.build();
    }

}
