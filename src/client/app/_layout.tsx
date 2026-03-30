/*
------------------------------------------------------------
_layout.tsx
Déclare la pile de navigation principale Expo Router, enrobée par les providers gestuels, AppSetup et AppScreen, avec Toasts configurés.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { JSX } from "react"
import { Stack } from "expo-router"
import Toast from 'react-native-toast-message'
import toastConfig from "@/theme/toastConfig"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import AppScreen from "@/components/AppScreen"
import AppSetup from "@/service/AppSetup"

export default function RootLayout(): JSX.Element {

  return (
    <GestureHandlerRootView>
      <AppSetup>
          <AppScreen>
            <Stack screenOptions={{headerShown:false}}/>
            <Toast config={toastConfig}/>
          </AppScreen>
      </AppSetup>
    </GestureHandlerRootView>
  )
}
