import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import '../services/ai_service.dart';
import '../models/chat_message.dart';
import 'settings_screen.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  late stt.SpeechToText _speech;
  late FlutterTts _flutterTts;
  final AiService _aiService = AiService();

  bool _isListening = false;
  bool _speechEnabled = false;
  bool _isAiThinking = false;

  final List<ChatMessage> _history = [];
  final List<Map<String, String>> _messages = [
    {'role': 'assistant', 'text': 'Dzień dobry! Kliknij mikrofon i powiedz, w czym mogę pomóc.'},
  ];

  @override
  void initState() {
    super.initState();
    _speech = stt.SpeechToText();
    _flutterTts = FlutterTts();
    _initSpeech();
  }

  void _initSpeech() async {
    _speechEnabled = await _speech.initialize(
      onError: (val) {},
      onStatus: (val) {
        if (val == 'done' || val == 'notListening') {
          setState(() => _isListening = false);
        }
      },
    );
    setState(() {});
  }

  void _listen() async {
    if (!_isListening && _speechEnabled) {
      setState(() => _isListening = true);
      await _speech.listen(
        onResult: (val) {
          setState(() {
            _textController.text = val.recognizedWords;
          });
        },
        localeId: 'pl_PL',
      );
    } else {
      setState(() => _isListening = false);
      await _speech.stop();
    }
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _sendMessage(String text) async {
    if (text.trim().isEmpty) return;

    // 1. Add User Message to UI and history
    final userMsg = {'role': 'user', 'text': text};
    _history.add(ChatMessage(role: 'user', content: text));
    setState(() {
      _messages.add(userMsg);
      _isListening = false;
      _isAiThinking = true; // <--- TURN ON LOADING
    });

    _speech.stop();
    _textController.clear();
    _scrollToBottom();

    // 2. Get Real (or Mock) Response with conversation history
    try {
      // We pass "General" context for now, later we pull from PreferencesProvider
      String responseText = await _aiService.getResponse(text, "General", _history);

      final aiMsg = {'role': 'assistant', 'text': responseText};
      _history.add(ChatMessage(role: 'model', content: responseText));

      // 3. Update UI with AI Response
      if (mounted) {
        setState(() {
          _messages.add(aiMsg);
          _isAiThinking = false; // <--- TURN OFF LOADING
        });
        _scrollToBottom();
        _speak(responseText); // Read it aloud
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isAiThinking = false);
      }
    }
  }

  Future _speak(String text) async {
    await _flutterTts.setLanguage("pl-PL");
    await _flutterTts.setPitch(1.0);
    await _flutterTts.speak(text);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Asystent MOC60+'),
        centerTitle: true,
        bottom: _isAiThinking
            ? const PreferredSize(
                preferredSize: Size.fromHeight(4.0),
                child: LinearProgressIndicator(color: Color(0xFF0052CC)),
              )
            : null,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings, size: 30),
            onPressed: () {
              // Navigate to the new Settings Screen
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const SettingsScreen()),
              );
            },
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    padding: const EdgeInsets.all(16),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                    decoration: BoxDecoration(
                      color: isUser ? const Color(0xFFE3F2FD) : Colors.white,
                      border: Border.all(color: Colors.grey.shade300),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(msg['text']!, style: const TextStyle(fontSize: 18)),
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Column(
              children: [
                GestureDetector(
                  onTap: _listen,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    height: _isListening ? 90 : 80,
                    width: _isListening ? 90 : 80,
                    decoration: BoxDecoration(
                      color: _isListening ? Colors.red : const Color(0xFF0052CC),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: (_isListening ? Colors.red : const Color(0xFF0052CC)).withValues(alpha: 0.4),
                          blurRadius: 15,
                          spreadRadius: 2,
                        )
                      ],
                    ),
                    child: Icon(
                      _isListening ? Icons.stop : Icons.mic,
                      color: Colors.white,
                      size: 40,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  _isListening ? "Słucham..." : "Naciśnij, aby mówić",
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _textController,
                        style: const TextStyle(fontSize: 18),
                        enabled: !_isAiThinking,
                        decoration: InputDecoration(
                          hintText: 'Napisz wiadomość...',
                          filled: true,
                          fillColor: Colors.grey.shade100,
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(30), borderSide: BorderSide.none),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(Icons.send, color: Color(0xFF0052CC), size: 30),
                      onPressed: _isAiThinking ? null : () => _sendMessage(_textController.text),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
