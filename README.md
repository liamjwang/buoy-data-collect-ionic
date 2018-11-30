# buoy-data-collect-ionic

Data collection app for the WaterWand smart buoy


#### iOS Build Instructions
- Run `ionic cordova build ios --prod`
- Open the `.xcodeproj` file in `platforms/ios/` in Xcode
- Under `Project Settings > General > Signing > Team` select team

If taking a sample doesnt work, make sure `NSLocationWhenInUseUsageDescription` is set in xcode config
