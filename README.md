# expo-wechat

专为 Expo  打造的微信集成解决方案。
更新于2025年12月。
基于最新微信官方 SDK 开发，为 Expo 项目提供稳定可靠的微信功能支持：

- ✅ **微信登录** - OAuth 2.0 授权登录
- ✅ **社交分享** - 文本、图片、网页、文件、音视频分享
- ✅ **微信支付** - 完整的支付功能集成
- 📱 **双平台支持** - 完整的 iOS & Android 兼容


## 前期准备

在开始使用本库之前，请确保你已经准备好以下内容：

### 必需配置

1. **微信 AppID**
   - 在 [微信开放平台](https://open.weixin.qq.com/) 注册并创建移动应用
   - 获取应用的 **AppID**（格式：`wx` + 16位字符）
   - 完成应用的基本信息填写和审核

2. **iOS Universal Links 配置**（仅 iOS 需要）
   - 为什么需要：iOS 系统需要通过 Universal Links 来实现应用间的跳转和回调。如果不配置，将导致：
     - ❌ 无法接收微信登录回调
     - ❌ 无法接收分享回调
     - ❌ 无法接收支付回调
   - 详细配置步骤请参考：[iOS Universal Links 配置指南](./docs/ios-universal-links.md)

### 支付功能额外配置（仅支付需要）

如果你需要使用微信支付功能，还需要额外准备：

- **商户号（MCHID）** - 在微信支付商户平台申请
- **API 密钥（API Key）** - 用于签名验证
- **证书文件** - 用于退款等高级功能（可选）

> 💡 **提示**：如果只需要登录和分享功能，可以暂时跳过支付相关配置。

## 快速开始
```bash
npx expo install expo-wechat-sdk
```

或

```bash
yarn add expo-wechat-sdk
```

> 📖 **详细配置步骤请参考**：[iOS Universal Links 配置指南](./docs/ios-universal-links.md)


## 在expo中一键配置

### 1. 安装插件

```bash
npx expo install expo-wechat-sdk
```

或

```bash
yarn add expo-wechat-sdk
```

### 2. 配置 app.json

在项目根目录的 `app.json` 或 `app.config.js` 中添加插件配置：

```json
{
  "expo": {
    "plugins": [
      "expo-wechat-sdk"
    ],
    "ios": {
      "infoPlist": {
        "LSApplicationQueriesSchemes": ["weixin", "weixinULAPI", "weixinURLParamsAPI"],
        "CFBundleURLTypes": [
          {
            "CFBundleTypeRole": "Editor",
            "CFBundleURLName": "wexin",
            "CFBundleURLSchemes": ["wx你的AppID"]
          }
        ]
      }
    },
    "android": {
      "package": "com.your.package.name"
    }
  }
}
```

**重要说明：**
- 将 `wx你的AppID` 替换为你在微信开放平台申请的实际 AppID
- `android.package` 需要设置为你的应用包名

![Set URL Types in XCode](./image/app-json.png)

### 3. 插件自动配置功能

本插件会自动完成以下配置：

#### Android 自动配置
- ✅ **ProGuard 混淆规则**：自动添加微信 SDK 的混淆规则，防止代码混淆导致的功能异常
- ✅ **Android 11+ 兼容**：自动添加 `<queries>` 标签，确保在 Android 11 及以上版本正常使用

#### iOS 自动配置
- ✅ 通过 `app.json` 中的 `ios.infoPlist` 配置自动应用 URL Schemes 和查询方案

### 4. 执行预构建

运行以下命令生成原生项目：

```bash
npx expo prebuild
```

### 5. 验证配置

预构建完成后，可以检查以下文件确认配置是否正确：

**Android:**
- `android/app/proguard-rules.pro` - 应包含微信 SDK 的混淆规则
- `android/app/src/main/AndroidManifest.xml` - 应包含 `<queries>` 标签

**iOS:**
- `ios/你的项目名/Info.plist` - 应包含 `CFBundleURLTypes` 和 `LSApplicationQueriesSchemes`

> ⚠️ **重要提示**：不建议手动修改原生项目配置文件（如 `Info.plist`、`AndroidManifest.xml` 等），因为这些文件在运行 `npx expo prebuild` 时会被重新生成，手动修改会被覆盖。如果遇到配置问题，欢迎提交 [Issue](https://github.com/joohw/expo-wechat/issues) 或 [Pull Request](https://github.com/joohw/expo-wechat/pulls)。

## 调用库
```javascript
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as WeChat from 'expo-wechat-sdk';

export default function App() {
    return (
        <View style={styles.container}>
            <Text onPress={()=>{
                WeChat.registerApp('wx54d90c03e686b854', 'https://www.baidu.com/').then((a)=>{
                    console.log("==registerApp==>",a);
                });
            }}>registerApp</Text>
            <Text onPress={()=>{
                WeChat.isWXAppInstalled().then((a)=>{
                    console.log("==isWXAppInstalled==>",a);
                });
            }}>isWXAppInstalled</Text>
            <Text onPress={()=>{
                WeChat.getApiVersion().then((a)=>{
                    console.log("==getApiVersion==>",a);
                });
            }}>getApiVersion</Text>
            <Text onPress={()=>{
                WeChat.openWXApp().then((a)=>{
                    console.log("==openWXApp==>",a);
                });
            }}>openWXApp</Text>
            <Text onPress={()=>{
                WeChat.shareText({
                    text: 'Text content.',
                    scene: 0,
                }).then((a)=>{
                    console.log("==shareText==>",a);
                });
            }}>shareText</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

```


## API 文档

本库支持 `TypeScript`，使用 `Promise` 或 `async/await` 来接收返回。

接口名称和参数尽量跟腾讯官网保持一致性，除了嵌套对象变成扁平对象，你可以直接查看腾讯文档来获得更多帮助。

#### registerApp(appid) 注册

- `appid` {String} the appid you get from WeChat dashboard
- returns {Boolean} explains if your application is registered done

This method should be called once globally.

```js
import * as WeChat from 'expo-wechat-sdk';

WeChat.registerApp('appid', 'universalLink');
```

#### isWXAppInstalled() 判断微信是否已安装

- returns {Boolean} if WeChat is installed.

Check if the WeChat app is installed on the device.

#### isWXAppSupportApi() 检查支持情况

- returns {Boolean} Contains the result.

Check if wechat support open url.

#### getApiVersion() 获取 API 版本号

- returns {String} Contains the result.

Get the WeChat SDK api version.

#### openWXApp() 打开微信

- returns {Boolean}

Open the WeChat app from your application.

#### sendAuthRequest([scope[, state]]) 微信授权登录

- `scope` {Array|String} Scopes of auth request.
- `state` {String} the state of OAuth2
- returns {Object}

Send authentication request, and it returns an object with the
following fields:

| field   | type   | description                         |
| ------- | ------ | ----------------------------------- |
| errCode | Number | Error Code                          |
| errStr  | String | Error message if any error occurred |
| openId  | String |                                     |
| code    | String | Authorization code                  |
| url     | String | The URL string                      |
| lang    | String | The user language                   |
| country | String | The user country                    |

#### ShareText(ShareTextMetadata) 分享文本

ShareTextMetadata

| name  | type   | description                    |
| ----- | ------ | ------------------------------ |
| text  | String | 分享文本                       |
| scene | Number | 分享到, 0:会话 1:朋友圈 2:收藏 |

Return:

| name    | type   | description                         |
| ------- | ------ | ----------------------------------- |
| errCode | Number | 0 if authorization succeed          |
| errStr  | String | Error message if any error occurred |

```js
import * as WeChat from 'expo-wechat-sdk';

WeChat.shareText({
  text: 'Text content.',
  scene: 0,
});
```

#### ShareImage(ShareImageMetadata) 分享图片

ShareImageMetadata

| name     | type   | description                    |
| -------- | ------ | ------------------------------ |
| imageUrl | String | 图片地址                       |
| scene    | Number | 分享到, 0:会话 1:朋友圈 2:收藏 |

Return:

| name    | type   | description                         |
| ------- | ------ | ----------------------------------- |
| errCode | Number | 0 if authorization succeed          |
| errStr  | String | Error message if any error occurred |

```js
import * as WeChat from 'expo-wechat-sdk';

WeChat.shareImage({
  imageUrl: 'https://google.com/1.jpg',
  scene: 0,
});
```

#### ShareLocalImage(ShareImageMetadata) 分享本地图片

ShareImageMetadata

| name     | type   | description                    |
| -------- | ------ | ------------------------------ |
| imageUrl | String | 图片地址                       |
| scene    | Number | 分享到, 0:会话 1:朋友圈 2:收藏 |

Return:

| name    | type   | description                         |
| ------- | ------ | ----------------------------------- |
| errCode | Number | 0 if authorization succeed          |
| errStr  | String | Error message if any error occurred |

#### ShareFile(ShareFileMetadata) 分享文件

ShareFileMetadata

| name  | type   | description    |
| ----- | ------ | -------------- |
| url   | String | 文件地址       |
| title | String | 文件标题       |
| scene | Number | 分享到, 0:会话 |

Return:

| name    | type   | description                         |
| ------- | ------ | ----------------------------------- |
| errCode | Number | 0 if authorization succeed          |
| errStr  | String | Error message if any error occurred |

```js
import * as WeChat from 'expo-wechat-sdk';

WeChat.shareFile({
  imageUrl: 'https://sdcard/test.png',
  title: '测试文件.pdf',
  scene: 0,
});
```

#### ShareMusic(ShareMusicMetadata) 分享音乐

ShareMusicMetadata

| name                | type   | description                           |
| ------------------- | ------ | ------------------------------------- |
| title               | String | 标题                                  |
| description         | String | 描述                                  |
| thumbImageUrl       | String | 缩略图地址，本库会自动压缩到 32KB     |
| musicUrl            | String | 音频网页的 URL 地址                   |
| musicLowBandUrl     | String | 供低带宽环境下使用的音频网页 URL 地址 |
| musicDataUrl        | String | 音频数据的 URL 地址                   |
| musicLowBandDataUrl | String | 供低带宽环境下使用的音频数据 URL 地址 |
| scene               | Number | 分享到, 0:会话 1:朋友圈 2:收藏        |

Return:

| name    | type   | description                         |
| ------- | ------ | ----------------------------------- |
| errCode | Number | 0 if authorization succeed          |
| errStr  | String | Error message if any error occurred |

```js
import * as WeChat from 'expo-wechat-sdk';

WeChat.shareMusic({
  title: 'Good music.',
  musicUrl: 'https://google.com/music.mp3',
  thumbImageUrl: 'https://google.com/1.jpg',
  scene: 0,
});
```

#### ShareVideo(ShareVideoMetadata) 分享视频

ShareVideoMetadata

| name            | type   | description                       |
| --------------- | ------ | --------------------------------- |
| title           | String | 标题                              |
| description     | String | 描述                              |
| thumbImageUrl   | String | 缩略图地址，本库会自动压缩到 32KB |
| videoUrl        | String | 视频链接                          |
| videoLowBandUrl | String | 供低带宽的环境下使用的视频链接    |
| scene           | Number | 分享到, 0:会话 1:朋友圈 2:收藏    |

Return:

| name    | type   | description                         |
| ------- | ------ | ----------------------------------- |
| errCode | Number | 0 if authorization succeed          |
| errStr  | String | Error message if any error occurred |

```js
import * as WeChat from 'expo-wechat-sdk';

WeChat.shareVideo({
  title: 'Interesting video.',
  videoUrl: 'https://google.com/music.mp3',
  thumbImageUrl: 'https://google.com/1.jpg',
  scene: 0,
});
```

#### ShareWebpage (ShareWebpageMetadata) 分享网页

ShareWebpageMetadata

| name          | type   | description                       |
| ------------- | ------ | --------------------------------- |
| title         | String | 标题                              |
| description   | String | 描述                              |
| thumbImageUrl | String | 缩略图地址，本库会自动压缩到 32KB |
| webpageUrl    | String | HTML 链接                         |
| scene         | Number | 分享到, 0:会话 1:朋友圈 2:收藏    |

Return:

| name    | type   | description                         |
| ------- | ------ | ----------------------------------- |
| errCode | Number | 0 if authorization succeed          |
| errStr  | String | Error message if any error occurred |

```js
import * as WeChat from 'expo-wechat-sdk';

WeChat.shareWebpage({
  title: 'Interesting web.',
  webpageUrl: 'https://google.com/page.html',
  thumbImageUrl: 'https://google.com/1.jpg',
  scene: 0,
});
```

#### pay(payload) 支付

- `payload` {Object} 支付数据
    - `partnerId` {String} 商家向财付通申请的商家 ID
    - `prepayId` {String} 预支付订单 ID
    - `nonceStr` {String} 随机串
    - `timeStamp` {String} 时间戳
    - `package` {String} 商家根据财付通文档填写的数据和签名
    - `sign` {String} 商家根据微信开放平台文档对数据做的签名
- returns {Object} 返回支付结果

发送支付请求，返回结果对象：

| name    | type   | description                         |
| ------- | ------ | ----------------------------------- |
| errCode | Number | 0 表示支付成功                      |
| errStr  | String | 错误信息（如果有）                  |

```js
import * as WeChat from 'expo-wechat-sdk';

WeChat.pay({
  partnerId: 'your_partner_id',
  prepayId: 'your_prepay_id',
  nonceStr: 'random_string',
  timeStamp: 'timestamp',
  package: 'Sign=WXPay',
  sign: 'your_sign'
});
```

## 回调事件订阅

分享和支付完成后会触发回调事件，请在调用相应方法前提前添加事件监听。

```js
import { DeviceEventEmitter } from 'react-native';
import * as WeChat from 'expo-wechat-sdk';

// 注册应用
WeChat.registerApp('your_app_id', 'your_universal_link');

// 监听分享回调
DeviceEventEmitter.addListener('WeChat_Resp', resp => {
  console.log('微信回调:', resp);
  
  if (resp.type === 'SendMessageToWX.Resp') {
    // 分享回调
    if (resp.errCode === 0) {
      console.log('分享成功');
    } else {
      console.log('分享失败:', resp.errStr);
    }
  } else if (resp.type === 'PayReq.Resp') {
    // 支付回调
    if (resp.errCode === 0) {
      console.log('支付成功');
    } else {
      console.log('支付失败:', resp.errStr);
    }
  } else if (resp.type === 'SendAuth.Resp') {
    // 登录回调
    if (resp.errCode === 0) {
      console.log('登录成功，code:', resp.code);
    } else {
      console.log('登录失败:', resp.errStr);
    }
  }
});
```
