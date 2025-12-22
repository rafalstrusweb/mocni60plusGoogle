import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/preferences_provider.dart'; // Ensure this file exists from previous step
import 'screens/welcome_screen.dart';
import 'screens/auth_screen.dart';
import 'screens/interest_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/settings_screen.dart'; // Import the new screen

// We will move screens to their own files in the next step,
// but for this specific step, keep your Screen classes in this file 
// OR move them to lib/screens/ now. 
// For safety, I will show you how to wrap the App first.

void main() {
  runApp(
    // 1. INJECT THE BRAIN (Provider)
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => PreferencesProvider()),
      ],
      child: const MocApp(),
    ),
  );
}

class MocApp extends StatelessWidget {
  const MocApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 2. LISTEN TO THE BRAIN
    final prefs = Provider.of<PreferencesProvider>(context);

    return MaterialApp(
      title: 'MOC60+',
      debugShowCheckedModeBanner: false,
      
      // 3. DYNAMIC THEME (Updates automatically when prefs change)
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: prefs.highContrast ? Colors.black : Colors.white,
        appBarTheme: AppBarTheme(
           backgroundColor: prefs.highContrast ? Colors.grey[900] : Colors.blue[50],
           foregroundColor: prefs.highContrast ? Colors.white : Colors.black,
        ),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0052CC),
          brightness: prefs.highContrast ? Brightness.dark : Brightness.light,
        ),
        
        // DYNAMIC TYPOGRAPHY
        textTheme: TextTheme(
          bodyMedium: TextStyle(fontSize: prefs.fontSize, height: 1.5),
          bodyLarge: TextStyle(fontSize: prefs.fontSize + 4, fontWeight: FontWeight.w600),
          titleLarge: TextStyle(fontSize: prefs.fontSize + 8, fontWeight: FontWeight.bold),
        ),
      ),
      
      home: const WelcomeScreen(), // Ensure your WelcomeScreen class is available
    );
  }
}
