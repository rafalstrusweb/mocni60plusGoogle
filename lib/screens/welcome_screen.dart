import 'package:flutter/material.dart';
import 'auth_screen.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.favorite, size: 80, color: Color(0xFF0052CC)),
              const SizedBox(height: 40),
              const Text(
                'Dzień dobry!',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              const Text(
                'Jestem Twoim osobistym asystentem MOC60+.\n\nPomogę Ci w codziennych sprawach.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 20),
              ),
              const Spacer(),
              ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const AuthScreen()),
                  );
                },
                child: const Text('Rozpocznij'),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
