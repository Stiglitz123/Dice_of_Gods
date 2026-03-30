/*
------------------------------------------------------------
_layout.tsx
Définit le top-tab navigator du lobby (artefacts, combat, religion) avec icônes Ionicons et styles de barre.
[Auteur : Frédéric Desrosiers]
-------------------------------------------------------------
*/
import { withLayoutContext } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

const ICON_SIZE: number = 30
const ARTIFACT_COLOR : string = 'cyan'
const COMBAT_COLOR : string = 'white'
const RELIGION_COLOR : string = 'orange'

const TopTabs = withLayoutContext(createMaterialTopTabNavigator().Navigator)

export default function TabLayout() {
    return(
        <TopTabs
          id="lobby"
          screenOptions={{
            tabBarShowIcon: true,
            swipeEnabled: true,
            tabBarActiveTintColor: "pink",
            tabBarInactiveTintColor: "white",
            tabBarStyle: {
              backgroundColor: 'black'
            },
            tabBarLabelStyle: {
              fontSize: 16,
              fontWeight: 'bold'
            },
            tabBarIndicatorStyle: {
              backgroundColor: "pink",
              height: 3
            },
          }}
        >
          <TopTabs.Screen
            name='artifactTab'
            options={{
              title: 'Artefact',
              tabBarIcon: ({focused}) => (
                <Ionicons 
                  name={focused ? 'diamond' : 'diamond-outline'}
                  size={ICON_SIZE}
                  color={ARTIFACT_COLOR}
                />
              )
            }}
          />
          <TopTabs.Screen
            name='combatTab'
            options={{
              title: 'Combat',
              tabBarIcon: ({focused}) => (
                <Ionicons 
                  name={focused ? 'dice' : 'dice-outline'}
                  size={ICON_SIZE}
                  color={COMBAT_COLOR}
                />
              )
            }}
          />
          <TopTabs.Screen
            name='religionTab'
            options={{
              title: 'Religion',
              tabBarIcon: ({focused}) => (
                <Ionicons 
                  name={focused ? 'flash' : 'flash-outline'}
                  size={ICON_SIZE}
                  color={RELIGION_COLOR}
                />
              )
            }}
          />
        </TopTabs>
    )
}
