package com.logcharge;

import android.app.Notification;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.IBinder;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.support.v4.content.LocalBroadcastManager;
import android.util.Base64;
import android.util.Log;

import java.io.ByteArrayOutputStream;
public class NotificationListener extends NotificationListenerService {

    Context context;

    private String TAG = this.getClass().getSimpleName();

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d("KBT", "FROM LISTENER CLASS");
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
    public void onNotificationPosted(StatusBarNotification sbn) {

        Log.d("KBT", "FROM LISTENER onNotificationPosted");
        if(!sbn.isOngoing()){
            String packageName = sbn.getPackageName();
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
            extras.putString("packageName", packageName);
            extras.putString("appName", appName);
            extras.putString("timeStamp", Long.toString(notification.when));
//        String title = extras.getString("android.title");
//
//
//        Log.d("KBT", "pack" +pack);
//        Log.d("KBT",ticker);
//        Log.d("KBT",title);
            Log.d("KBT","Lets see bundle: STARTKBT : " + extras.toString() + ": ENDKBT");


            Intent msgrcv = new Intent("NOTIFICATION_POSTED_KBT");
            msgrcv.putExtras(extras);

            LocalBroadcastManager.getInstance(context).sendBroadcast(msgrcv);
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        Log.i(TAG, "********** onNOtificationRemoved");
        Log.i(TAG, "ID :" + sbn.getId() + "t" + sbn.getNotification().tickerText + "t" + sbn.getPackageName());
    }

}
