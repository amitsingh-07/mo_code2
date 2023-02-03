package com.moneyowl.app;

import com.getcapacitor.BridgeActivity;
import android.webkit.WebSettings;

public class MainActivity extends BridgeActivity {
  public void onResume() {
    super.onResume();
    WebSettings settings = bridge.getWebView().getSettings();
    settings.setTextZoom(100);
    settings.setSupportZoom(false);
  }
}
