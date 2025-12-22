import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/chat_message.dart';

class AiService {
  final String _apiKey = 'AIzaSyAKz67X0EkwSuNV13VSnE-C3ezSd0LgH8g'; 
  
  final bool _useMockMode = false; 

  String? _selectedModel;

  Future<void> _ensureModelSelected() async {
    if (_selectedModel != null) return;
    try {
      final listUrl = 'https://generativelanguage.googleapis.com/v1beta/models?key=$_apiKey';
      final r = await http.get(Uri.parse(listUrl));
      if (r.statusCode == 200) {
        final data = jsonDecode(utf8.decode(r.bodyBytes));
        final List models = data['models'] ?? [];
        String? pick;
        for (final m in models) {
          final name = m['name'] as String?;
          final methods = (m['supportedGenerationMethods'] as List?)?.map((e) => e.toString()).toList() ?? [];
          if (name != null && methods.contains('generateContent')) {
            if (name.contains('gemini-2.5') || name.contains('gemini-2.0') || name.contains('gemini-flash')) {
              pick = name.split('/').last;
              break;
            }
            pick ??= name.split('/').last;
          }
        }
        _selectedModel = pick ?? 'gemini-2.0-flash';
        print('[AiService] Selected model: $_selectedModel');
      } else {
        print('[AiService] ListModels failed: ${r.statusCode} ${r.body}');
        _selectedModel = 'gemini-2.0-flash';
      }
    } catch (e) {
      print('[AiService] ListModels exception: $e');
      _selectedModel = 'gemini-2.0-flash';
    }
  }

  Future<String> getResponse(String userMessage, String? userContext, List<ChatMessage> history) async {
    if (_useMockMode) return "Tryb testowy.";

    await _ensureModelSelected();
    final modelForUrl = _selectedModel ?? 'gemini-2.0-flash';
    final url = 'https://generativelanguage.googleapis.com/v1beta/models/$modelForUrl:generateContent?key=$_apiKey';

    try {
      // Build conversation history: keep last 10 messages for context
      List<Map<String, dynamic>> conversationHistory = [];
      int start = history.length > 10 ? history.length - 10 : 0;
      
      for (int i = start; i < history.length; i++) {
        var msg = history[i];
        conversationHistory.add({
          "role": msg.role == 'user' ? "user" : "model",
          "parts": [{ "text": msg.content }]
        });
      }

      // Add the current user message
      conversationHistory.add({
        "role": "user",
        "parts": [{ "text": userMessage }]
      });

      final response = await http.post(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "system_instruction": {
            "parts": [
              { "text": """
Jesteś MOC - przyjaznym opiekunem i asystentem dla osoby 60+ w Polsce.
Mówisz ciepło, zrozumiale i po polsku.
Twoim celem jest podtrzymanie rozmowy i pomoc.
Nie używaj markdown (gwiazdek, pogrubień), pisz czystym tekstem.
Jeśli nie wiesz co powiedzieć, zadaj proste pytanie o samopoczucie.
Użytkownik interesuje się: $userContext.
""" }
            ]
          },
          
          // Send full conversation history + new message
          "contents": conversationHistory,

          "generationConfig": {
            "temperature": 0.9,
            "maxOutputTokens": 1024,
          }
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(utf8.decode(response.bodyBytes));
        String? reply = data['candidates']?[0]['content']?['parts']?[0]['text'];
        
        return reply?.replaceAll('**', '').replaceAll('*', '') ?? "Przepraszam, nie zrozumiałem.";
      } else {
        try {
          final body = utf8.decode(response.bodyBytes);
          print('[AiService] generateContent failed: ${response.statusCode} $body');
        } catch (e) {
          print('[AiService] generateContent failed with status ${response.statusCode} and unreadable body');
        }
        return "Mój cyfrowy mózg ma chwilową czkawkę. Spróbuj ponownie.";
      }
    } catch (e) {
      print('[AiService] Exception in getResponse: $e');
      return "Brak połączenia z internetem.";
    }
  }
}
