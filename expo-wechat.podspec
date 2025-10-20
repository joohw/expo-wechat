# expo-wechat.podspec

require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "expo-wechat" 
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                   为 Expo 和 React Native 提供微信登录、分享、支付功能的原生模块。
                   基于最新微信 SDK 开发，支持 iOS 和 Android 平台。
                   DESC
  s.homepage     = "https://github.com/joohw/expo-wechat"
  s.license      = "MIT"
  s.authors      = { 
    "Joo" => "1546635571@qq.com"
        "原作者" => "zeng-zhiming<171314432@qq.com>",
  }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/joohw/expo-wechat.git", :tag => "#{s.version}" }
  s.source_files = "ios/**/*.{h,c,cc,cpp,m,mm,swift}"
  s.requires_arc = true
  s.dependency "React"
  s.dependency 'WechatOpenSDK-XCFramework'
end

