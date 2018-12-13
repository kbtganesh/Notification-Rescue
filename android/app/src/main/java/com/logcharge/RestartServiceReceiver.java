package com.logcharge;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

public class RestartServiceReceiver extends BroadcastReceiver
{

    private static final String TAG = "RestartServiceReceiver";

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.e("KBT", "RestartServiceReceiver onReceive");
        Toast.makeText(context, "Re-Starting service..", Toast.LENGTH_LONG).show();
        context.startService(new Intent(context.getApplicationContext(), NotificationListener.class));
    }

}
