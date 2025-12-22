import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/preferences_provider.dart';
import 'chat_screen.dart';

class InterestScreen extends StatefulWidget {
  const InterestScreen({super.key});

  @override
  State<InterestScreen> createState() => _InterestScreenState();
}

class _InterestScreenState extends State<InterestScreen> {
  final Set<String> selectedInterests = {};

  final List<String> options = [
    'Zdrowie i Leki',
    'Technologia',
    'Rozmowa i Hobby',
    'Sprawy Urzędowe',
    'Bezpieczeństwo',
    'Zakupy',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('O Tobie'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          const Padding(
            padding: EdgeInsets.all(24.0),
            child: Text(
              'W jakich tematach potrzebujesz wsparcia? (Wybierz kilka)',
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: options.length,
              itemBuilder: (context, index) {
                final option = options[index];
                final isSelected = selectedInterests.contains(option);

                return Padding(
                  padding: const EdgeInsets.only(bottom: 16.0),
                  child: InkWell(
                    onTap: () {
                      setState(() {
                        if (isSelected) {
                          selectedInterests.remove(option);
                        } else {
                          selectedInterests.add(option);
                        }
                      });
                    },
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFFE3F2FD) : Colors.white,
                        border: Border.all(
                          color: isSelected ? const Color(0xFF0052CC) : Colors.grey.shade400,
                          width: isSelected ? 3 : 1,
                        ),
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: [
                          if (!isSelected)
                            BoxShadow(
                              color: Colors.grey.shade200,
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            )
                        ],
                      ),
                      child: Row(
                        children: [
                          Icon(
                            isSelected ? Icons.check_circle : Icons.circle_outlined,
                            size: 32,
                            color: isSelected ? const Color(0xFF0052CC) : Colors.grey,
                          ),
                          const SizedBox(width: 16),
                          Text(
                            option,
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: selectedInterests.isEmpty
                    ? null
                    : () async {
                        final prefs = Provider.of<PreferencesProvider>(context, listen: false);
                        await prefs.setInterests(selectedInterests);
                        Navigator.pushReplacement(
                          context,
                          MaterialPageRoute(builder: (context) => const ChatScreen()),
                        );
                      },
                child: const Text('Dalej'),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
