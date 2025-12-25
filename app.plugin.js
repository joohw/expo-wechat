// Expo 配置插件 - 微信 SDK
const { withInfoPlist, withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');


// ProGuard 混淆规则
const PROGUARD_RULES = '# 微信 SDK 混淆规则\n-keep class com.tencent.mm.opensdk.** {\n    *;\n}\n\n-keep class com.tencent.wxop.** {\n    *;\n}\n\n-keep class com.tencent.mm.sdk.** {\n    *;\n}\n';


// WXEntryActivity 模板
const WX_ENTRY_ACTIVITY_TEMPLATE = (packageName) => `package ${packageName}.wxapi;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import com.goldstar.wechat.WeChatModule;

public class WXEntryActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WeChatModule.handleIntent(getIntent());
        finish();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        WeChatModule.handleIntent(intent);
        finish();
    }
}
`;


// 插件主函数
const withExpoWeChat = (config, props = {}) => {
    config = withInfoPlist(config, (config) => {
        return config;
    });
    config = withAndroidManifest(config, (config) => {
        const packageName = config.android?.package || config.android?.packageName;
        if (packageName && config.modResults.manifest) {
            const manifest = config.modResults.manifest;
            if (!manifest.application) {
                manifest.application = [{}];
            }
            const mainApplication = manifest.application[0];
            if (!mainApplication.activity) {
                mainApplication.activity = [];
            }
            const existingActivity = mainApplication.activity.find(
                (activity) => activity.$ && activity.$['android:name'] === '.wxapi.WXEntryActivity'
            );
            if (!existingActivity) {
                mainApplication.activity.push({
                    $: {
                        'android:name': '.wxapi.WXEntryActivity',
                        'android:exported': 'true',
                        'android:taskAffinity': packageName,
                        'android:launchMode': 'singleTask',
                        'android:theme': '@android:style/Theme.Translucent.NoTitleBar'
                    }
                });
            }
        }
        return config;
    });
    config = withDangerousMod(config, [
        'android',
        async (config) => {
            const packageName = config.android?.package || config.android?.packageName;
            const platformProjectRoot = config.modRequest.platformProjectRoot;
            if (packageName && platformProjectRoot) {
                const packagePath = packageName.split('.').join('/');
                const wxapiDir = path.join(platformProjectRoot, 'app', 'src', 'main', 'java', packagePath, 'wxapi');
                const wxEntryActivityPath = path.join(wxapiDir, 'WXEntryActivity.java');
                if (!fs.existsSync(wxEntryActivityPath)) {
                    if (!fs.existsSync(wxapiDir)) {
                        fs.mkdirSync(wxapiDir, { recursive: true });
                    }
                    const activityContent = WX_ENTRY_ACTIVITY_TEMPLATE(packageName);
                    fs.writeFileSync(wxEntryActivityPath, activityContent, 'utf-8');
                }
            }
            const proguardRulesPath = path.join(platformProjectRoot, 'app', 'proguard-rules.pro');
            let proguardContent = '';
            if (fs.existsSync(proguardRulesPath)) {
                proguardContent = fs.readFileSync(proguardRulesPath, 'utf-8');
            }
            if (!proguardContent.includes('com.tencent.mm.opensdk')) {
                proguardContent += '\n' + PROGUARD_RULES;
                fs.writeFileSync(proguardRulesPath, proguardContent, 'utf-8');
            }
            return config;
        }
    ]);
    return config;
};


module.exports = withExpoWeChat;

