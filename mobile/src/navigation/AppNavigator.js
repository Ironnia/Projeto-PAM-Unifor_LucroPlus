import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import EstoqueScreen from '../screens/EstoqueScreen';
import PromocoesScreen from '../screens/PromocoesScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import { authApi } from '../services/api';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Estoque') {
              iconName = focused ? 'cube' : 'cube-outline';
            } else if (route.name === 'Promoções') {
              iconName = focused ? 'pricetag' : 'pricetag-outline';
            } else if (route.name === 'Configurações') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#6c63ff',
          tabBarInactiveTintColor: '#888',
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
            borderTopColor: '#2a2a4e',
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
              <Ionicons name="log-out-outline" size={22} color="#ff5252" />
            </TouchableOpacity>
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
        <Tab.Screen name="Estoque" component={EstoqueScreen} />
        <Tab.Screen name="Promoções" component={PromocoesScreen} />
        <Tab.Screen name="Configurações" component={ConfiguracoesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
