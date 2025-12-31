import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ScanQRScreen from '../screens/ScanQRScreen';
import TopUpScreen from '../screens/TopUpScreen';
import GenerateQRScreen from '../screens/GenerateQRScreen';
import WithdrawScreen from '../screens/WithdrawScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import { THEME } from '../constants/theme';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <StatusBar barStyle="light-content" backgroundColor={THEME.COLORS.bg} />
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: THEME.COLORS.bg },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                <Stack.Screen name="ScanQR" component={ScanQRScreen} />
                <Stack.Screen name="TopUp" component={TopUpScreen} />
                <Stack.Screen name="GenerateQR" component={GenerateQRScreen} />
                <Stack.Screen name="Withdraw" component={WithdrawScreen} />
                <Stack.Screen name="Transactions" component={TransactionsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
