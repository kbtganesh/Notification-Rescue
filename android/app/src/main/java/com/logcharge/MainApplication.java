package com.logcharge;

import android.Manifest;
import android.app.Activity;
import android.app.Application;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.sbugert.rnadmob.RNAdMobPackage;
import io.realm.react.RealmReactPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNDeviceInfo(),
            new RNAdMobPackage(),
            new RealmReactPackage(),
            new VectorIconsPackage(),
              new BatteryStatusPackage()
      );
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
    SoLoader.init(this, /* native exopackage */ false);
    // Intent intent = new Intent("NOTIFICATION_POSTED_KBT");
    
//    PendingIntent pendingIntent = PendingIntent.getBroadcast(context, 0,
//                                          intent, PendingIntent.FLAG_UPDATE_CURRENT);
//    Calendar calendar = Calendar.getInstance();
//    calendar.setTimeInMillis(System.currentTimeMillis());
//    calendar.add(Calendar.MINUTE, 1);
//
//    AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
//    alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, calendar.getTimeInMillis(), 1000 * 60, pendingIntent);
    Log.d("KBTCHECK","MainApplication Oncreate");
//    Intent notificationIntent = new Intent(getApplicationContext(), NotificationListener.class);
//    startService(notificationIntent);
  }
}
