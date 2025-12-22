class ChatMessage {
  final String role; // 'user' or 'model'
  final String content;

  ChatMessage({required this.role, required this.content});
}
