import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, View } from "react-native";


import React from "react";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import DealerScreen from "./screens/DealerScreen";
import CatalogScreen from "./screens/CatalogScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { Colors } from "../utils";




const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const notificationCount=5
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Notifications") {
            iconName = "bell";
          } else if (route.name === "Chat") {
            iconName = "message-square"; // Feather icon for chat
          }

          return (
            <View>

              {route.name === "Notifications" && notificationCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: Colors.Red,
                    borderRadius: 10,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    minWidth: 18,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: Colors.white, fontSize: 12, fontWeight: "bold" }}>
                    {notificationCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: Colors.secondary,
        tabBarInactiveTintColor: Colors.gray,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Catalog" component={CatalogScreen} />
      <Tab.Screen name="Dealers" component={DealerScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const RootStack = createNativeStackNavigator({
  screens: {
    WelcomeScreen: {
      screen: WelcomeScreen,
      options: {
        headerShown: false,
      },
    },
 Login: {
      screen: LoginScreen,
      options: {
        headerShown: false,
      },
    },
    HomeTabs: {
      screen: BottomTabNavigator,
      options: {
        title: "Home",
        headerShown: false,
      },
    },
   
  },
});

export const Navigation = createStaticNavigation(RootStack);

// type RootStackParamList = StaticParamList<typeof RootStack>;
type RootStackParamList = {
  WelcomeScreen: undefined; // No params expected
    HomeTabs: undefined;
  Login:undefined;
 
};
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

