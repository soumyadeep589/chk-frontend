import React, { useState } from 'react';

import { WebView } from 'react-native-webview';


export function AboutUsScreen({ navigation }) {
    return <WebView source={{ uri: 'https://docs.google.com/document/d/1s07xBAR13u9a_Ax5GerfSDNxxHqPDBg_gBeUx5Dg0as/edit?usp=sharing' }} style={{ flex: 1 }} />;
}
