import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/preferences_provider.dart'; // Make sure this path is correct

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // We use "Consumer" so this specific widget rebuilds when settings change
    return Consumer<PreferencesProvider>(
      builder: (context, prefs, child) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Ustawienia'),
            centerTitle: true,
          ),
          body: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Wygląd Aplikacji',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 20),

                // --- 1. FONT SIZE SLIDER ---
                Text('Rozmiar tekstu: ${prefs.fontSize.toInt()}',
                    style: const TextStyle(fontSize: 18)),
                
                const SizedBox(height: 10),
                
                // A Big Slider for Seniors
                Slider(
                  value: prefs.fontSize,
                  min: 14.0,
                  max: 30.0,
                  divisions: 8,
                  label: prefs.fontSize.toString(),
                  onChanged: (double newValue) {
                    // This creates the "Magic" - updates the whole app instantly
                    prefs.setFontSize(newValue);
                  },
                ),
                
                // Live Preview Box
                Container(
                  padding: const EdgeInsets.all(16),
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade300),
                  ),
                  child: Text(
                    "Tak będzie wyglądał tekst w aplikacji.",
                    style: Theme.of(context).textTheme.bodyMedium, // Uses the dynamic theme
                  ),
                ),

                const SizedBox(height: 40),

                // --- 2. HIGH CONTRAST SWITCH ---
                SwitchListTile(
                  title: const Text("Wysoki Kontrast"),
                  subtitle: const Text("Czarne tło, biały tekst"),
                  value: prefs.highContrast,
                  onChanged: (bool value) {
                    prefs.toggleContrast();
                  },
                ),

                const Spacer(),

                // --- 3. LOGOUT BUTTON ---
                SizedBox(
                  width: double.infinity,
                  child: OutlinedButton.icon(
                    icon: const Icon(Icons.logout),
                    label: const Text("Wyloguj się"),
                    onPressed: () {
                      // In the future, we clear data here
                      Navigator.pop(context); // Close settings
                      Navigator.pop(context); // Go back to login (simplified)
                    },
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.all(16),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
