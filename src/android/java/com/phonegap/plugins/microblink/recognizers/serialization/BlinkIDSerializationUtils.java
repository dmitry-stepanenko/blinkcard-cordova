package com.phonegap.plugins.microblink.recognizers.serialization;

import com.microblink.entities.recognizers.blinkid.imageoptions.extension.ImageExtensionFactors;

import org.json.JSONException;
import org.json.JSONObject;

public abstract class BlinkIDSerializationUtils {

    public static ImageExtensionFactors deserializeExtensionFactors(JSONObject jsonExtensionFactors) {
        if (jsonExtensionFactors == null) {
            return new ImageExtensionFactors(0.f, 0.f, 0.f, 0.f);
        } else {
            float up = (float)jsonExtensionFactors.optDouble("upFactor", 0.0);
            float right = (float)jsonExtensionFactors.optDouble("rightFactor", 0.0);
            float down = (float)jsonExtensionFactors.optDouble("downFactor", 0.0);
            float left = (float)jsonExtensionFactors.optDouble("leftFactor", 0.0);
            return new ImageExtensionFactors(up, down, left, right);
        }
    }
}
