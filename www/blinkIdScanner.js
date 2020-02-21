/**
 * cordova is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 *
 * Copyright (c) Matt Kane 2010
 * Copyright (c) 2011, IBM Corporation
 */


var exec = require("cordova/exec");

/**
 * Constructor.
 *
 * @returns {BlinkID}
 */
function BlinkID() {

};

/**
 * successCallback: callback that will be invoked on successful scan
 * errorCallback: callback that will be invoked on error
 * overlaySettings: settings for desired camera overlay
 * recognizerCollection: {RecognizerCollection} containing recognizers to use for scanning
 * licenses: object containing:
 *               - base64 license keys for iOS and Android
 *               - optioanl parameter 'licensee' when license for multiple apps is used
 *               - optional flag 'showTimeLimitedLicenseKeyWarning' which indicates
 *                  whether warning for time limited license key will be shown, in format
 *  {
 *      ios: 'base64iOSLicense',
 *      android: 'base64AndroidLicense',
 *      licensee: String,
 *      showTimeLimitedLicenseKeyWarning: Boolean
 *  }
 */
BlinkID.prototype.scanWithCamera = function (successCallback, errorCallback, overlaySettings, recognizerCollection, licenses) {
    if (errorCallback == null) {
        errorCallback = function () {
        };
    }

    if (typeof errorCallback != "function") {
        console.log("BlinkIDScanner.scanWithCamera failure: failure parameter not a function");
        throw new Error("BlinkIDScanner.scanWithCamera failure: failure parameter not a function");
        return;
    }

    if (typeof successCallback != "function") {
        console.log("BlinkIDScanner.scanWithCamera failure: success callback parameter must be a function");
        throw new Error("BlinkIDScanner.scanWithCamera failure: success callback parameter must be a function");
        return;
    }

    // first invalidate old results
    for (var i = 0; i < recognizerCollection.recognizerArray[i].length; ++i ) {
        recognizerCollection.recognizerArray[i].result = null;
    }

    exec(
        function internalCallback(scanningResult) { 
            var cancelled = scanningResult.cancelled;

            if (cancelled) {
                successCallback(true);
            } else {
                var results = scanningResult.resultList;
                if (results.length != recognizerCollection.recognizerArray.length) {
                    console.log("INTERNAL ERROR: native plugin returned wrong number of results!");
                    throw new Error("INTERNAL ERROR: native plugin returned wrong number of results!");
                    errorCallback(new Error("INTERNAL ERROR: native plugin returned wrong number of results!"));
                } else {
                    for (var i = 0; i < results.length; ++i) {
                        // native plugin must ensure types match
                        recognizerCollection.recognizerArray[i].result = recognizerCollection.recognizerArray[i].createResultFromNative(results[i]);
                    }
                    successCallback(false);
                }
            }    
        },
        errorCallback, 'BlinkIDScanner', 'scanWithCamera', [overlaySettings, recognizerCollection, licenses]);
};

// COMMON CLASSES

/**
 * Base class for all recognizers.
 * Recognizer is object that performs recognition of image
 * and updates its result with data extracted from the image.
 */
function Recognizer(recognizerType) {
    /** Type of recognizer */
    this.recognizerType = recognizerType;
    /** Recognizer's result */
    this.result = null;
}

/**
 * Possible states of the Recognizer's result
 */
var RecognizerResultState = Object.freeze(
    {
        /** Recognizer result is empty */
        empty : 1,
        /** Recognizer result contains some values, but is incomplete or it contains all values, but some are not uncertain */
        uncertain : 2,
        /** Recognizer resul contains all required values */
        valid : 3
    }
);

/**
 * Possible states of the Recognizer's result
 */
BlinkID.prototype.RecognizerResultState = RecognizerResultState;

/**
 * Base class for all recognizer's result objects.
 * Recoginzer result contains data extracted from the image.
 */
function RecognizerResult(resultState) {
    /** State of the result. It is always one of the values represented by BlinkIDScanner.RecognizerResultState enum */
    this.resultState = resultState;
}

/**
 * Represents a collection of recognizer objects.
 * @param recognizerArray Array of recognizer objects that will be used for recognition. Must not be empty!
 */
function RecognizerCollection(recognizerArray) {
    /** Array of recognizer objects that will be used for recognition */
    this.recognizerArray = recognizerArray;
    /** 
     * Whether or not it is allowed for multiple recognizers to process the same image.
     * If not, then first recognizer that will be successful in processing the image will
     * end the processing chain and other recognizers will not get the chance to process 
     * that image.
     */
    this.allowMultipleResults = false;
    /** Number of miliseconds after first non-empty result becomes available to end scanning with a timeout */
    this.milisecondsBeforeTimeout = 10000;

    if (!(this.recognizerArray.constructor === Array)) {
        throw new Error("recognizerArray must be array of Recognizer objects!");
    }
    // ensure every element in array is Recognizer
    for (var i = 0; i < this.recognizerArray.length; ++i) {
        if (!(this.recognizerArray[i] instanceof Recognizer )) {
            throw new Error( "Each element in recognizerArray must be instance of Recognizer" );
        }
    }
}

BlinkID.prototype.RecognizerCollection = RecognizerCollection;

/**
 * Represents a date extracted from image.
 */
function Date(nativeDate) {
    /** day in month */
    this.day = nativeDate.day;
    /** month in year */
    this.month = nativeDate.month;
    /** year */
    this.year = nativeDate.year;
}

BlinkID.prototype.Date = Date;


/**
 * Supported BlinkCard card issuer values.
 */
BlinkID.prototype.CardIssuer = Object.freeze(
    {
        /** Unidentified Card */
        Other: 1,
        /** The American Express Company Card */
        AmericanExpress: 2,
        /** The Bank of Montreal ABM Card */
        BmoAbm: 3,
        /** China T-Union Transportation Card */
        ChinaTUnion: 4,
        /** China UnionPay Card */
        ChinaUnionPay: 5,
        /** Canadian Imperial Bank of Commerce Advantage Debit Card */
        CibcAdvantageDebit: 6,
        /** CISS Card */
        Ciss: 7,
        /** Diners Club International Card */
        DinersClubInternational: 8,
        /** Diners Club United States & Canada Card */
        DinersClubUsCanada: 9,
        /** Discover Card */
        DiscoverCard: 10,
        /** HSBC Bank Canada Card */
        Hsbc: 11,
        /** RuPay Card */
        RuPay: 12,
        /** InterPayment Card */
        InterPayment: 13,
        /** InstaPayment Card */
        InstaPayment: 14,
        /** The JCB Company Card */
        Jcb: 15,
        /** Laser Debit Card (deprecated) */
        Laser: 16,
        /** Maestro Debit Card */
        Maestro: 17,
        /** Dankort Card */
        Dankort: 18,
        /** MIR Card */
        Mir: 19,
        /** MasterCard Inc. Card */
        MasterCard: 20,
        /** The Royal Bank of Canada Client Card */
        RbcClient: 21,
        /** ScotiaBank Scotia Card */
        ScotiaBank: 22,
        /** TD Canada Trust Access Card */
        TdCtAccess: 23,
        /** Troy Card */
        Troy: 24,
        /** Visa Inc. Card */
        Visa: 25,
        /** Universal Air Travel Plan Inc. Card */
        Uatp: 26,
        /** Interswitch Verve Card */
        Verve: 27
    }
);

/**
 * Extension factors relative to corresponding dimension of the full image. For example,
 * upFactor and downFactor define extensions relative to image height, e.g.
 * when upFactor is 0.5, upper image boundary will be extended for half of image's full
 * height.
 */
function ImageExtensionFactors() {
    /** image extension factor relative to full image height in UP direction. */
    this.upFactor = 0.0;
    /** image extension factor relative to full image height in RIGHT direction. */
    this.rightFactor = 0.0;
    /** image extension factor relative to full image height in DOWN direction. */
    this.downFactor = 0.0;
    /** image extension factor relative to full image height in LEFT direction. */
    this.leftFactor = 0.0;
}

BlinkID.prototype.ImageExtensionFactors = ImageExtensionFactors;

// COMMON CLASSES

// OVERLAY SETTINGS

/** Base class for all overlay settings objects */
function OverlaySettings(overlaySettingsType) {
    /** type of the overlay settings object */
    this.overlaySettingsType = overlaySettingsType;
}

/**
 * Class for setting up BlinkCard overlay.
 * BlinkCard overlay is best suited for scanning payment cards.
 */
function BlinkCardOverlaySettings() {
    OverlaySettings.call(this, 'BlinkCardOverlaySettings');
    /** 
    * String: user instructions that are shown above camera preview while the first side of the
    * document is being scanned.
    * If null, default value will be used.
    */
    this.firstSideInstructions = null;
    /** 
    * String: user instructions that are shown above camera preview while the second side of the
    * document is being scanned.
    * If null, default value will be used.
    */
    this.secondSideInstructions = null;
}
BlinkCardOverlaySettings.prototype = new OverlaySettings();

BlinkID.prototype.BlinkCardOverlaySettings = BlinkCardOverlaySettings;


// OVERLAY SETTINGS

// RECOGNIZERS

/**
 * Result object for BlinkCardRecognizer.
 */
function BlinkCardRecognizerResult(nativeResult) {
    RecognizerResult.call(this, nativeResult.resultState);
    
    /** 
     * The payment card number. 
     */
    this.cardNumber = nativeResult.cardNumber;
    
    /** 
     *  Payment card's security code/value 
     */
    this.cvv = nativeResult.cvv;
    
    /** 
     * Digital signature of the recognition result. Available only if enabled with signResult property. 
     */
    this.digitalSignature = nativeResult.digitalSignature;
    
    /** 
     * Version of the digital signature. Available only if enabled with signResult property. 
     */
    this.digitalSignatureVersion = nativeResult.digitalSignatureVersion;
    
    /** 
     * Returns true if data from scanned parts/sides of the document match,
     * false otherwise. For example if date of expiry is scanned from the front and back side
     * of the document and values do not match, this method will return false. Result will
     * be true only if scanned values for all fields that are compared are the same. 
     */
    this.documentDataMatch = nativeResult.documentDataMatch;
    
    /** 
     * back side image of the document if enabled with returnFullDocumentImage property. 
     */
    this.fullDocumentBackImage = nativeResult.fullDocumentBackImage;
    
    /** 
     * front side image of the document if enabled with returnFullDocumentImage property. 
     */
    this.fullDocumentFrontImage = nativeResult.fullDocumentFrontImage;
    
    /** 
     * Payment card's inventory number. 
     */
    this.inventoryNumber = nativeResult.inventoryNumber;
    
    /** 
     * Payment card's issuing networ 
     */
    this.issuer = nativeResult.issuer;
    
    /** 
     * Information about the payment card owner (name, company, etc.). 
     */
    this.owner = nativeResult.owner;
    
    /** 
     * Returns true if recognizer has finished scanning first side and is now scanning back side,
     * false if it's still scanning first side. 
     */
    this.scanningFirstSideDone = nativeResult.scanningFirstSideDone;
    
    /** 
     * The payment card's last month of validity. 
     */
    this.validThru = nativeResult.validThru != null ? new Date(nativeResult.validThru) : null;
    
}

BlinkCardRecognizerResult.prototype = new RecognizerResult(RecognizerResultState.empty);

BlinkID.prototype.BlinkCardRecognizerResult = BlinkCardRecognizerResult;

/**
 * Recognizer used for scanning the front side of credit/debit cards.
 */
function BlinkCardRecognizer() {
    Recognizer.call(this, 'BlinkCardRecognizer');
    
    /** 
     * Should anonymize the card number area (redact image pixels) on the document image result
     * 
     *  
     */
    this.anonymizeCardNumber = false;
    
    /** 
     * Should anonymize the CVV on the document image result
     * 
     *  
     */
    this.anonymizeCvv = false;
    
    /** 
     * Should anonymize the owner area (redact image pixels) on the document image result
     * 
     *  
     */
    this.anonymizeOwner = false;
    
    /** 
     * Defines if glare detection should be turned on/off.
     * 
     *  
     */
    this.detectGlare = true;
    
    /** 
     * Should extract CVV
     * 
     *  
     */
    this.extractCvv = false;
    
    /** 
     * Should extract the card's inventory number
     * 
     *  
     */
    this.extractInventoryNumber = false;
    
    /** 
     * Should extract the card owner information
     * 
     *  
     */
    this.extractOwner = false;
    
    /** 
     * Should extract the payment card's month of expiry
     * 
     *  
     */
    this.extractValidThru = false;
    
    /** 
     * Property for setting DPI for full document images
     * Valid ranges are [100,400]. Setting DPI out of valid ranges throws an exception
     * 
     *  
     */
    this.fullDocumentImageDpi = 250;
    
    /** 
     * Image extension factors for full document image.
     * 
     * @see ImageExtensionFactors
     *  
     */
    this.fullDocumentImageExtensionFactors = new ImageExtensionFactors();
    
    /** 
     * Sets whether full document image of ID card should be extracted.
     * 
     *  
     */
    this.returnFullDocumentImage = false;
    
    /** 
     * Whether or not recognition result should be signed.
     * 
     *  
     */
    this.signResult = false;
    
    this.createResultFromNative = function (nativeResult) { return new BlinkCardRecognizerResult(nativeResult); }

}

BlinkCardRecognizer.prototype = new Recognizer('BlinkCardRecognizer');

BlinkID.prototype.BlinkCardRecognizer = BlinkCardRecognizer;


// RECOGNIZERS

// export BlinkIDScanner
module.exports = new BlinkID();