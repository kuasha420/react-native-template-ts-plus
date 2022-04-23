package com.helloworld;

// For React Native Immersive Bar DayNightDetection
import android.content.res.Configuration;

// For React Native BootSplash
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;

// For React Native Gensute Handler
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

// For React Native Bootsplash
import com.zoontek.rnbootsplash.RNBootSplash;

// For React Native Immersive Bars
import com.rnimmersivebars.ImmersiveBars;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "HelloWorld";
  }

    /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the rendered you wish to use (Fabric or the older renderer).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName()) {
      // React Native Gensute Handler
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }
    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    // React Native Immersive Bars
    boolean isDarkMode = false;
    int currentNightMode = getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK;

    if (currentNightMode == Configuration.UI_MODE_NIGHT_YES) {
      isDarkMode = true;
    }

    ImmersiveBars.changeBarColors(this, isDarkMode);
    
    // Reaact Native Screens 
    // See: https://github.com/software-mansion/react-native-screens/issues/17#issuecomment-424704633
    super.onCreate(null);

    // React Native Bootsplash
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this);
  }
}
