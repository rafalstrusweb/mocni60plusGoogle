# MOC60+ AI Agent Instructions

## Project Overview

**MOC60+** is a Flutter-based voice-enabled mobile assistant designed for users 60+. The core mission is accessibility: large fonts, high-contrast colors, voice I/O (Polish speech-to-text and text-to-speech), and simplified navigation patterns.

**Tech Stack:**
- Flutter (Material Design 3) targeting Android, iOS, Linux, macOS, Windows
- Speech-to-text (`speech_to_text: ^6.6.0`) for Polish voice input (hardcoded `localeId: 'pl_PL'`)
- Text-to-speech (`flutter_tts: ^3.8.3`) for Polish audio responses
- HTTP client for backend communication (not yet integrated)
- No state management framework yet (consider Provider/Riverpod if complexity grows)

## Architecture

All application code lives in `lib/main.dart` (single-file architecture). The app is structured as a linear navigation flow through four screens, each as a stateless or stateful widget:

1. **WelcomeScreen** → Entry point with "Rozpocznij" (Start) button
2. **AuthScreen** → Login/Register toggle (currently simulates auth with 1s delay)
3. **InterestScreen** → User interest selection (6 predefined categories in Polish)
4. **ChatScreen** → Main conversational interface with voice + text

**No modular structure yet.** As the app grows beyond 600 lines, consider extracting screens to `lib/screens/` and shared utilities to `lib/utils/`.

## Critical Patterns & Accessibility

### 1. Accessibility-First Design
- **Typography:** All text minimum 18px (bodyMedium), titles 26px (titleLarge)
- **Buttons:** Large padding (32px horizontal, 20px vertical), 16px rounded corners
- **Colors:** High contrast (Color(0xFF0052CC) blue on white, pure black text)
- **Icons:** Always accompanied by text labels and large tap targets

### 2. Language & Localization
- **Default:** Polish (pl-PL) throughout
- **Speech APIs:** Always use `localeId: 'pl_PL'` in `_speech.listen()` calls
- **Text-to-Speech:** Set with `_flutterTts.setLanguage("pl-PL")`
- **UI Strings:** Use Polish text directly (no i18n framework yet)

### 3. Voice I/O Pattern
Implemented in ChatScreen (lines 330–450):
```dart
// Initialize: _speech = stt.SpeechToText(), _flutterTts = FlutterTts()
// Start listening: await _speech.listen(localeId: 'pl_PL', onResult: callback)
// Speak response: await _flutterTts.setLanguage("pl-PL"); await _flutterTts.speak(text)
```
- Listen state is tracked via `_isListening` flag (stops automatically on "done" status)
- Text updates live in UI during speech recognition
- Tap microphone to toggle; icon changes from mic → stop when active
- Always call `_speech.stop()` before sending messages to prevent conflicts

### 4. Navigation Pattern
- **No named routes.** Use `Navigator.push()` or `Navigator.pushReplacement()` (replace used to prevent back navigation)
- **SafeArea:** Wraps all screens to respect notch/battery bar
- **Scrolling:** ChatScreen uses `ScrollController` with auto-scroll to bottom on new messages

### 5. Message State Management
ChatScreen stores messages as `List<Map<String, String>>` with keys `{'role': 'user'|'assistant', 'text': '...'}`. Display logic:
```dart
final isUser = msg['role'] == 'user';
Align(alignment: isUser ? Alignment.centerRight : Alignment.centerLeft, ...)
```
- No database/persistence yet (in-memory only, lost on app close)
- Simulated 1s delay for AI response; replace with real API call later

## Backend API Pattern

**CRITICAL:** Never embed API keys (OpenAI, Anthropic, etc.) in Flutter code. Senior data + health info requires secure, RODO-compliant backend.

### Required Endpoint: POST /api/chat
```json
// Request (App → Backend)
{
  "user_id": "uuid_123",                    // Anonymous ID (RODO-compliant, no PII)
  "message": "Bolą mnie plecy",             // User query in Polish
  "context": ["Zdrowie", "Technologia"],    // Selected interests from InterestScreen
  "history": [                              // Last 4 messages for conversation flow
    {"role": "user", "text": "..."},
    {"role": "assistant", "text": "..."}
  ]
}

// Response (Backend → App)
{
  "reply": "Rozumiem. Proszę nie bagatelizować bólu...",
  "suggested_action": "open_exercises",    // Optional: trigger screen navigation
  "error": null                             // If error, reply may be empty
}
```

### Implementation Notes
- Backend should offload AI inference to secure cloud service (OpenAI/Anthropic)
- Store API keys on backend only; use UUID for anonymous user tracking
- Log conversations locally on device; only transmit to cloud for AI processing
- Add request timeout: 30s (seniors may have slow connections)
- Implement retry logic with exponential backoff for reliability

### Current Integration Point
Replace the 1s simulated delay in `ChatScreen._sendMessage()` (line ~440) with actual HTTP POST:
```dart
final response = await http.post(Uri.parse('$_backendUrl/api/chat'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'user_id': _userId,
    'message': text,
    'context': selectedInterests,
    'history': _messages.take(4).toList(),
  }),
  timeout: const Duration(seconds: 30),
).catchError((_) => handleNetworkError());
```

---

## State Management (Provider Pattern)

**CRITICAL for Settings:** Font size, high contrast mode, language preferences must persist and react app-wide immediately.

### Architecture: PreferencesProvider
Use `provider` package (Dependency Injection like Java Spring). Currently app uses setState; this won't scale for user preferences affecting multiple screens.

**Setup:**
```bash
flutter pub add provider
```

**Create `lib/providers/preferences_provider.dart`:**
```dart
final preferencesProvider = StateNotifierProvider<PreferencesNotifier, PreferencesState>((ref) {
  return PreferencesNotifier();
});

class PreferencesState {
  final double fontSize;        // Default 20.0, range 16-32
  final bool highContrast;      // Default false
  final String language;        // Default 'pl'
  final List<String> interests; // From InterestScreen
  final String userId;          // Anonymous UUID
}

class PreferencesNotifier extends StateNotifier<PreferencesState> {
  PreferencesNotifier() : super(PreferencesState(...));
  
  void setFontSize(double size) => state = state.copyWith(fontSize: size);
  void toggleHighContrast() => state = state.copyWith(highContrast: !state.highContrast);
  // ... other setters
}
```

**Wrap app with ProviderScope:**
```dart
@override
Widget build(BuildContext context) {
  return ProviderScope(
    child: MaterialApp(
      theme: _buildTheme(fontSize: prefs.fontSize, highContrast: prefs.highContrast),
      home: WelcomeScreen(),
    ),
  );
}
```

**Use in ChatScreen:**
```dart
class ChatScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prefs = ref.watch(preferencesProvider);
    
    // Text automatically updates when fontSize changes elsewhere
    Text('Message', style: TextStyle(fontSize: prefs.fontSize))
  }
}
```

**Why Provider over Riverpod?** Provider is simpler for teams transitioning from Java; Riverpod requires more Dart/functional knowledge.

---

## Persistent Storage (Hybrid: Local + Cloud)

**Strategy:** Local phone storage for privacy, cloud sync only for AI processing.

### 1. User Preferences (shared_preferences)
Font size, high contrast, selected interests—simple key-value store, persists across app restarts.

```bash
flutter pub add shared_preferences
```

**Integration with PreferencesProvider:**
```dart
// On app start, load from shared_preferences
final prefs = await SharedPreferences.getInstance();
state = state.copyWith(
  fontSize: prefs.getDouble('fontSize') ?? 20.0,
  highContrast: prefs.getBool('highContrast') ?? false,
);

// On change, persist immediately
void setFontSize(double size) {
  state = state.copyWith(fontSize: size);
  prefs.setDouble('fontSize', size);
}
```

### 2. Chat History (sqflite / SQLite)
Store full conversation logs locally. RODO-compliant: user's phone is the source of truth.

```bash
flutter pub add sqflite
```

**Schema:**
```sql
CREATE TABLE chats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  role TEXT,              -- 'user' or 'assistant'
  message TEXT,
  context TEXT            -- JSON: ["Zdrowie", "Technologia"]
);
```

**Usage in ChatScreen:**
```dart
// Save message locally
await ChatDatabase.instance.insert({
  'user_id': userId,
  'role': 'user',
  'message': text,
  'context': jsonEncode(interests),
});

// Load history on startup
final history = await ChatDatabase.instance.query(userId, limit: 4);
```

### 3. Data Retention & RODO Compliance
- **Default retention:** 90 days; older chats auto-delete
- **User control:** Settings screen should offer "Delete chat history" button
- **No backup to cloud** unless explicit user consent
- **Export option:** Allow user to download their chat history as JSON (RODO data portability)

---

## Testing Approach (Accessibility + Voice)

### Accessibility Testing (Flutter Inspector)
**Requirement:** All tap targets ≥ 48×48 dp (current theme uses 80+, good).

```bash
flutter run -d <device>
# In DevTools, open "Inspector" tab → toggle "Show Accessibility Info"
```

Verify:
- Buttons have `semanticLabel` (screen readers)
- Text contrasts meet WCAG AA (4.5:1 for normal text)
- No text smaller than 18px

### Voice Testing (Mock Service Pattern)
Automated voice testing is impractical. Instead, inject a **MockSpeechService** for development.

**Create `lib/services/speech_service.dart` (interface):**
```dart
abstract class SpeechService {
  Future<void> initialize();
  Future<void> startListening(Function(String) onResult);
  Future<void> stop();
  Future<void> speak(String text);
}

// Real implementation
class RealSpeechService implements SpeechService { ... }

// Mock for testing/dev (types text automatically)
class MockSpeechService implements SpeechService {
  @override
  Future<void> startListening(Function(String) onResult) async {
    // Simulate voice input: auto-fill with test sentence
    await Future.delayed(Duration(seconds: 2));
    onResult('Bolą mnie plecy i kręgosłup');
  }
}
```

**Dependency Injection:**
```dart
final speechService = const bool.fromEnvironment('MOCK_SPEECH')
    ? MockSpeechService()
    : RealSpeechService();
```

**Build with mock:**
```bash
flutter run --dart-define=MOCK_SPEECH=true
```

### Senior Acceptance Tests
Create manual test checklist (can automate later with driver tests):
- [ ] Tap all buttons with thumb (no precision needed)
- [ ] Read text aloud to verify clarity
- [ ] Test with Android "Large Text" accessibility setting enabled
- [ ] Test on low-battery 3G network (API timeout handling)

---

## Platform-Specific Quirks

### iOS (iPhone)
**Microphone Permission Crisis:**
- If user denies microphone permission on first prompt, app cannot recover without manual Settings.app intervention
- Build a **PermissionDeniedScreen** that explains: "Go to Settings → MOC60+ → Microphone → Allow"

**Implementation:**
```dart
void _initSpeech() async {
  _speechEnabled = await _speech.initialize(...).catchError((e) {
    _showPermissionDeniedModal(context);
    return false;
  });
}

void _showPermissionDeniedModal(BuildContext context) {
  showDialog(
    context: context,
    child: AlertDialog(
      title: const Text('Mikrofon wymagany'),
      content: const Text('Przejdź do Ustawień → MOC60+ → Mikrofon → Zezwól'),
      actions: [
        ElevatedButton(
          onPressed: () => openAppSettings(), // Uses permission_handler package
          child: const Text('Otwórz Ustawienia'),
        ),
      ],
    ),
  );
}
```

### Android (Samsung, Pixel, etc.)
**Text-to-Speech Engine Variation:**
- Pixel phones: Use Google TTS (good Polish)
- Samsung: May use Samsung TTS (slower, different voice)
- Some older phones: Missing Polish language package

**Solution:**
```dart
void _initTts() async {
  final languages = await _flutterTts.getAvailableLanguages;
  if (!languages.contains('pl-PL')) {
    // Prompt user to install Polish language
    _showInstallLanguageDialog(context);
  }
  await _flutterTts.setLanguage('pl-PL');
  // Prefer Google engine if available
  if (defaultTargetPlatform == TargetPlatform.android) {
    await _flutterTts.setEngine('com.google.android.tts');
  }
}
```

**Add to pubspec.yaml:**
```yaml
dependencies:
  permission_handler: ^11.4.0  # For iOS Settings link
  flutter_tts: ^3.8.3          # Already there
```

---

## Development Workflow

### Building & Running
```bash
flutter pub get          # Install dependencies
flutter run              # Run on connected device/emulator
flutter run -d web       # Run on web (if needed)
flutter analyze          # Check lints (uses flutter_lints)
flutter run --dart-define=MOCK_SPEECH=true  # Dev mode with mock voice
```

### Testing
```bash
flutter test             # Unit & widget tests
flutter test --coverage  # Generate coverage report
flutter drive            # Integration tests (requires connected device)
```

### Key Dependencies to Know
- `cupertino_icons` provides iOS-style icons
- `provider` (new) for state management and DI
- `shared_preferences` (new) for lightweight persistence
- `sqflite` (new) for chat history
- `permission_handler` (new) for iOS Settings link
- `http` for backend communication
- `flutter_lints` enforces code standards

## Adding Features

### Adding a New Screen
1. Create a new `ConsumerWidget` (if uses Provider) in `lib/screens/` (new folder)
2. Add navigation in parent screen using `Navigator.push()` with `MaterialPageRoute`
3. **Always consume PreferencesProvider for font size & high contrast:**
   ```dart
   class SettingsScreen extends ConsumerWidget {
     @override
     Widget build(BuildContext context, WidgetRef ref) {
       final prefs = ref.watch(preferencesProvider);
       return Scaffold(...);
     }
   }
   ```
4. Ensure all text is Polish, all text 18px+, buttons 80px+ tap target
5. Use `SafeArea` and `Padding` for layout consistency

### Integrating Backend API (Already Documented Above)
1. Use `http` package (already added to pubspec.yaml)
2. In `ChatScreen._sendMessage()`, replace 1s delay with POST to `/api/chat` (see Backend API Pattern)
3. Add error handling: timeout, network error, server error
4. Show loading spinner during API call
5. Save response locally to sqflite before displaying

### Voice Features
- Always inject `SpeechService` (real or mock) rather than directly using `speech_to_text`
- Check language availability: `_flutterTts.getAvailableLanguages` before speaking
- Handle microphone permission denial gracefully (iOS)
- For Android, force Google TTS engine when available

### Adding Settings Screen
```dart
// New screens/settings_screen.dart
class SettingsScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prefs = ref.watch(preferencesProvider);
    final notifier = ref.read(preferencesProvider.notifier);
    
    return Scaffold(
      appBar: AppBar(title: const Text('Ustawienia')),
      body: ListView(
        children: [
          ListTile(
            title: const Text('Rozmiar czcionki'),
            trailing: Slider(
              value: prefs.fontSize,
              onChanged: (val) => notifier.setFontSize(val),
              min: 16, max: 32,
            ),
          ),
          ListTile(
            title: const Text('Wysoki kontrast'),
            trailing: Switch(
              value: prefs.highContrast,
              onChanged: (_) => notifier.toggleHighContrast(),
            ),
          ),
          ListTile(
            title: const Text('Usuń historię czatu'),
            onTap: () => ChatDatabase.instance.deleteAllChats(prefs.userId),
          ),
        ],
      ),
    );
  }
}
```

## Common Gotchas

1. **Polish locale required:** If voice doesn't recognize speech, verify `localeId: 'pl_PL'`
2. **iOS microphone permission:** User denies → app is bricked until they manually enable in Settings. Always build permission-denied flow.
3. **Android TTS missing language:** Some phones don't have Polish TTS. Check with `getAvailableLanguages` and show install prompt.
4. **API keys in code = security breach:** Never embed OpenAI/Anthropic keys. Always use backend.
5. **setState over screens:** Don't use setState for font size changes affecting multiple screens. Use Provider.
6. **Chat history persistence:** If not stored locally, user refreshes app = data lost. Use sqflite + shared_preferences.
7. **Single-file growth:** Once >1000 lines, split into `lib/screens/`, `lib/providers/`, `lib/services/`, `lib/models/`
8. **State management escalation:** If managing >3 independent features (preferences, chat, auth), migrate from setState to Provider
9. **Mock services in production:** Never leave `MOCK_SPEECH=true` in production build; use `--dart-define` for dev only
10. **RODO compliance:** Never send PII to cloud; use anonymous UUIDs. Chat history stored locally first, transmitted only for AI inference.

## File Structure (Current → Planned)

### Current (Single-file)
```
lib/
  main.dart                  # All code (will split when >1000 lines)
```

### Planned (Post-Refactor, All ≤250 lines each)
```
lib/
  main.dart                  # App entry, ProviderScope, theme
  screens/
    welcome_screen.dart
    auth_screen.dart
    interest_screen.dart
    chat_screen.dart
    settings_screen.dart     # NEW: Font size, high contrast, delete history
  providers/
    preferences_provider.dart     # NEW: Font size, contrast, interests, userId
  services/
    speech_service.dart           # NEW: Interface + Real + Mock implementations
    api_service.dart              # NEW: Backend communication
    database_service.dart         # NEW: sqflite chat storage
  models/
    message_model.dart            # {role, text}
    preferences_model.dart        # fontSize, highContrast, etc.
  utils/
    constants.dart                # Color(0xFF0052CC), text sizes
    theme_builder.dart            # Theme based on PreferencesProvider
```

### Key Migration Points
- **Current hardcoded colors/sizes** → `constants.dart`
- **All screens** → `lib/screens/` (separate files)
- **Speech + HTTP logic** → `lib/services/` (dependency injection)
- **Provider setup** → `providers/preferences_provider.dart`
- **Database init** → `services/database_service.dart` (initialize on app start)
