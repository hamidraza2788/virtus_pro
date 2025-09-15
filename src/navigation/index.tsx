import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeaderButton, Text } from "@react-navigation/elements";
import {
  createStaticNavigation,
  StaticParamList,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Image, Platform, View } from "react-native";
import ImagePath from "../assets/images/ImagePath";
import { useSafeAreaInsets } from 'react-native-safe-area-context';



import React from "react";
import WelcomeScreen from "./screens/WelcomeScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import DealerScreen from "./screens/DealerScreen";
import CatalogScreen from "./screens/CatalogScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SignupScreen from "./screens/SignupScreen";
import { Colors } from "../utils";




const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;
          if (route.name === "Home") {
            iconSource = ImagePath.HomeIcon;
          } else if (route.name === "Catalog") {
            iconSource = ImagePath.CateIcon;
          } else if (route.name === "Dealers") {
            iconSource = ImagePath.CartIcon;
          } else if (route.name === "Profile") {
            iconSource = ImagePath.ProfileIcon;
          }
            return (
            <Image
              source={iconSource}
              style={{
              width: 24,
              height: 24,
              tintColor: focused ? Colors.Purple : Colors.White,
              resizeMode: "contain",
              }}
            />
            );
        },
        tabBarActiveTintColor: Colors.Purple,
        tabBarInactiveTintColor: Colors.White,
        tabBarStyle: {
          backgroundColor: Colors.Black,
          borderRadius: 20,
          height: 70,
          borderTopWidth: 0,
          position: "absolute",
          marginHorizontal: 20,
          bottom: Platform.OS === 'ios' ? 20 : insets.bottom + 1,
          alignSelf: 'center',
          paddingTop: 8, // Added padding to give space for labels
          paddingBottom: 10, // Added padding to give space for labels
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 8,
        },
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
     Signup: {
      screen: SignupScreen,
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
  Signup:undefined;
 
};
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

