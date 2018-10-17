package com.logcharge;

import android.content.BroadcastReceiver;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.BatteryManager;
import android.os.Bundle;
import android.provider.Settings;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.support.v4.content.LocalBroadcastManager;
import android.telecom.Call;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.util.Set;

public class BatteryStatusModule extends ReactContextBaseJavaModule {
    private NLServiceReceiver myReceiver;
    public static Callback successCallback;
    DeviceEventManagerModule.RCTDeviceEventEmitter eventEmitter;
    Context mainContext;

    public BatteryStatusModule(ReactApplicationContext reactContext) {

        super(reactContext);
        myReceiver = new NLServiceReceiver();
        mainContext = getReactApplicationContext();


    }

    @Override
    public String getName() {
        return "BatteryStatus";
    }

    @ReactMethod
    public void isNotificationEnabled(Callback callback) {
        ComponentName cn = new ComponentName(getReactApplicationContext(), NotificationListener.class);
        String flat = Settings.Secure.getString(getReactApplicationContext().getContentResolver(), "enabled_notification_listeners");
        boolean enabled = flat != null && flat.contains(cn.flattenToString());
        if(enabled){
            Log.d("KBT", "NOTI ENABLE");
        }else{
            Log.d("KBT", "NOTI NOT ENABLE");
        }
        callback.invoke(enabled);
    }

    @ReactMethod
    public void requestForNotificationAccess() {
        Toast.makeText(getReactApplicationContext(), "Find 'Rescue Notification' in this list and Enable it.", Toast.LENGTH_LONG).show();
        getReactApplicationContext().startActivity(new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"));
    }

    @ReactMethod
    public void registerNotificationListener() {
        Log.d("KBT", " registerNotificationListener Android registered listener");
        LocalBroadcastManager.getInstance(mainContext).registerReceiver(myReceiver, new IntentFilter("NOTIFICATION_POSTED_KBT"));
    }

    @ReactMethod
    public void registerNotificationEvent(Callback successCallback) {
        Log.d("KBT", "Android registered listener");
        LocalBroadcastManager.getInstance(mainContext).registerReceiver(myReceiver, new IntentFilter("NOTIFICATION_POSTED_KBT"));
        ComponentName cn = new ComponentName(getReactApplicationContext(), NotificationListener.class);
        String flat = Settings.Secure.getString(getReactApplicationContext().getContentResolver(), "enabled_notification_listeners");
        final boolean enabled = flat != null && flat.contains(cn.flattenToString());
        if(!enabled) {
            Toast.makeText(getReactApplicationContext(), "Give me the fucking notification access", Toast.LENGTH_LONG).show();
            getReactApplicationContext().startActivity(new Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS"));
        }
        successCallback.invoke("notification_permission", enabled);
        Log.d("KBT","Initial method, Is permission enabled?" + enabled);


//        this.successCallback = successCallback;
//        IntentFilter headsetFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
//
//        Intent batteryIntent = getCurrentActivity().registerReceiver(myReceiver, headsetFilter);
//        int level = batteryIntent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
//        int scale = batteryIntent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
//        int battPct = level / (int) scale;
//
//        Log.d("KBT", "battery level" + level);
//        Log.d("KBT", "battery scale" + scale);
//        Log.d("KBT", "battery battPct" + battPct);
//        System.out.print(battPct);
//        WritableMap params = Arguments.createMap(); // add here the data you want to send
//        params.putString("event", "first"); // <- example
//        params.putInt("status", level);
//
//        getReactApplicationContext()
//                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                .emit("onHeadsetPlug", params);
//        Toast.makeText(getReactApplicationContext(), "headset change: " + battPct, Toast.LENGTH_LONG);
    }


    private class NLServiceReceiver extends BroadcastReceiver {

        @Override public void onReceive(Context context, Intent intent) {
            Bundle bundle = intent.getExtras();

            JSONObject json = new JSONObject();
            Set<String> keys = bundle.keySet();
            for (String key : keys) {
                try {
                    Log.d("KBT", "KEY-"+key);
                    Log.d("KBT", "BUNDLE-"+bundle.get(key));
                    Log.d("KBT", "JSON_WRAP-"+JSONObject.wrap(bundle.get(key)));
                    if(JSONObject.wrap(bundle.get(key)) != null){
                        Log.d("TBKTBK", "Wrap done");
                        json.put(key, JSONObject.wrap(bundle.get(key)));
                    }else{
                        Log.d("TBKTBK", "Wrap not done"+bundle.get(key));
                        json.put(key, bundle.get(key));
                    }
                    // json.put(key, bundle.get(key)); see edit below
                } catch(JSONException e) {
                    //Handle exception here
                }
            }
            Log.d("KBT", "keys" + keys.toString());
            WritableMap params = Arguments.createMap();
            params.putString("rawNotificationData", json.toString());
            getReactApplicationContext()
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onNotificationPosted", params);
        }
    }

    @ReactMethod
    public void getIcon(String packageNamesListJSON, Callback iconCallback) {
        Log.d("KBTTBK", "FUNC CALLED");
        try
        {
            JSONArray packageNamesList = new JSONArray(packageNamesListJSON);
            JSONObject json = new JSONObject();
            Log.d("KBTTBK",packageNamesList.getString(0));
            for(int i = 0; i < packageNamesList.length(); i++){
                try {
                    Drawable icon = getReactApplicationContext().getPackageManager().getApplicationIcon(packageNamesList.getString(i));
                    Bitmap iconBitmap = drawableToBitmap(icon);
                    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                    iconBitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
                    byte[] byteArray = byteArrayOutputStream.toByteArray();
                    String encoded = Base64.encodeToString(byteArray, Base64.DEFAULT);
                    json.put(packageNamesList.getString(i), encoded);
                } catch (PackageManager.NameNotFoundException e) {
                    Log.d("KBTTBK", "ERROR");
                    Log.d("KBTTBK", e.getMessage());
                    e.printStackTrace();
                }
            }
            WritableMap params = Arguments.createMap();
            params.putString("icons", json.toString());
            iconCallback.invoke(params);

        } catch (JSONException e) {
            WritableMap params = Arguments.createMap();
            params.putString("icons", "");
            iconCallback.invoke(params);
            Log.d("KBTTBK", "ERROR");
            Log.d("KBTTBK", e.getMessage());
            e.printStackTrace();
        }
    }

    public static Bitmap drawableToBitmap (Drawable drawable) {
        if (drawable instanceof BitmapDrawable) {
            return ((BitmapDrawable)drawable).getBitmap();
        }

        int width = drawable.getIntrinsicWidth();
        width = width > 0 ? width : 1;
        int height = drawable.getIntrinsicHeight();
        height = height > 0 ? height : 1;

        Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
        drawable.draw(canvas);

        return bitmap;
    }



//  private class MusicIntentReceiver extends BroadcastReceiver {
//        @Override public void onReceive(Context context, Intent intent) {
//            if (intent.getAction().equals(Intent.ACTION_BATTERY_CHANGED)) {
//                int level = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
//                int scale = intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
//                int battPct = level/(int)scale;
//
//                WritableMap params = Arguments.createMap(); // add here the data you want to send
//                params.putString("event", "otha"); // <- example
//                params.putInt("status", level);
//
//                getReactApplicationContext()
//                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
//                        .emit("onHeadsetPlug", params);
//            }
//        }
//    }
}