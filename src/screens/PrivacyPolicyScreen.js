import React, { useState } from 'react';

import { WebView } from 'react-native-webview';


export function PrivacyPolicyScreen({ navigation }) {
    return <WebView source={{ uri: 'https://docs.google.com/document/d/1EynAFXMDxEtkGzzl_GNONtg4MhWxKURGJLOGQgmE0xs/edit?usp=sharing' }} style={{ flex: 1 }} />;
}
