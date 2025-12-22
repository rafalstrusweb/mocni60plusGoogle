import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class PreferencesProvider extends ChangeNotifier {
  // --- STATE VARIABLES ---
  double _fontSize = 18.0;
  bool _highContrast = false;
  String? _username;
  Set<String> _interests = {};

  PreferencesProvider() {
    _loadFromPrefs();
  }

  // --- GETTERS (Read-only access) ---
  double get fontSize => _fontSize;
  bool get highContrast => _highContrast;
  String get username => _username ?? "Użytkownik";
  Set<String> get interests => _interests;

  // --- PERSISTENCE ---
  Future<void> _loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    _fontSize = prefs.getDouble('fontSize') ?? 18.0;
    _highContrast = prefs.getBool('highContrast') ?? false;
    _username = prefs.getString('username');
    final storedInterests = prefs.getStringList('interests') ?? [];
    _interests = storedInterests.toSet();
    notifyListeners();
  }

  // --- ACTIONS (Ways to change state) ---
  Future<void> setFontSize(double newSize) async {
    _fontSize = newSize;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble('fontSize', newSize);
  }

  Future<void> toggleContrast() async {
    _highContrast = !_highContrast;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('highContrast', _highContrast);
  }

  Future<void> setInterests(Set<String> newInterests) async {
    _interests = newInterests;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setStringList('interests', _interests.toList());
  }

  Future<void> login(String name) async {
    _username = name;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('username', name);
  }
}
