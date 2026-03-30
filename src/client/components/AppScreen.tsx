/*
------------------------------------------------------------
AppScreen.tsx
Enveloppe d’écran appliquant SafeArea, couleurs principales et configuration de la barre de navigation.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { ReactNode, useEffect} from "react";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "react-native"
import * as NavigationBar from 'expo-navigation-bar'
import commonStyles from "@/theme/styles"

export default function AppScreen({children}: {children : ReactNode}) {

    const insets = useSafeAreaInsets()

    useEffect(() => {
    NavigationBar.setStyle('dark')
    }, []);

    return (
        <SafeAreaProvider>
          <SafeAreaView 
            style={commonStyles.mainBlack} 
            edges={insets.bottom > 30 ? ['top'] : ['top', 'bottom']}
          >
            {children}
            <StatusBar barStyle='light-content'/>
          </SafeAreaView>
        </SafeAreaProvider>
    )
}
