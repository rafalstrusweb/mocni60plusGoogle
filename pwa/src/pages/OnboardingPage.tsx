import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Briefcase,
    Map,
    Users,
    Heart,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    CheckCircle2
} from 'lucide-react';

interface OnboardingStep {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
}

const steps: OnboardingStep[] = [
    {
        title: 'Witaj w Mocni60+!',
        description: 'Aplikacja stworzona z myślą o osobach 60+. Znajdziesz tu pracę, wycieczki i nowych znajomych.',
        icon: <Sparkles className="h-20 w-20" />,
        color: 'from-primary to-blue-600',
    },
    {
        title: 'Znajdź pracę dorywczą',
        description: 'Przeglądaj oferty pracy w swojej okolicy. Korepetycje, opieka nad zwierzętami, drobne naprawy - wybierz co Ci odpowiada.',
        icon: <Briefcase className="h-20 w-20" />,
        color: 'from-green-500 to-emerald-600',
    },
    {
        title: 'Podróżuj bezpiecznie',
        description: 'Wycieczki dostosowane do Twoich potrzeb. Sprawdź dostępność wind, płaski teren i inne udogodnienia.',
        icon: <Map className="h-20 w-20" />,
        color: 'from-orange-500 to-amber-600',
    },
    {
        title: 'Dołącz do społeczności',
        description: 'Poznaj osoby o podobnych zainteresowaniach. Grupy tematyczne, spotkania offline i nowe przyjaźnie.',
        icon: <Users className="h-20 w-20" />,
        color: 'from-purple-500 to-violet-600',
    },
];

const interests = [
    { id: 'work', label: 'Praca dorywcza', icon: Briefcase },
    { id: 'travel', label: 'Wycieczki', icon: Map },
    { id: 'community', label: 'Społeczność', icon: Users },
    { id: 'health', label: 'Zdrowie', icon: Heart },
];

export function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const navigate = useNavigate();
    const isLastStep = currentStep === steps.length;
    const isIntroComplete = currentStep >= steps.length;

    const handleNext = () => {
        if (isLastStep) {
            // Save onboarding completion
            localStorage.setItem('onboardingComplete', 'true');
            localStorage.setItem('userInterests', JSON.stringify(selectedInterests));
            navigate('/');
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleSkip = () => {
        localStorage.setItem('onboardingComplete', 'true');
        navigate('/');
    };

    // Interest selection step
    if (isIntroComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
                {/* Header */}
                <div className="p-4 flex justify-end">
                    <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                        Pomiń
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
                    <div className="w-full max-w-md">
                        <h1 className="text-3xl font-bold text-center mb-4">
                            Co Cię interesuje?
                        </h1>
                        <p className="text-lg text-muted-foreground text-center mb-8">
                            Wybierz tematy, które Cię interesują, a my dostosujemy aplikację do Twoich potrzeb.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            {interests.map((interest) => {
                                const Icon = interest.icon;
                                const isSelected = selectedInterests.includes(interest.id);
                                return (
                                    <button
                                        key={interest.id}
                                        onClick={() => toggleInterest(interest.id)}
                                        className={`
                                            relative p-6 rounded-2xl border-2 transition-all duration-200
                                            flex flex-col items-center gap-3 text-center
                                            ${isSelected
                                                ? 'border-primary bg-primary/5 shadow-lg scale-[1.02]'
                                                : 'border-border bg-white hover:border-primary/50'
                                            }
                                        `}
                                    >
                                        {isSelected && (
                                            <div className="absolute top-2 right-2">
                                                <CheckCircle2 className="h-6 w-6 text-primary" />
                                            </div>
                                        )}
                                        <Icon className={`h-10 w-10 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <span className={`text-lg font-medium ${isSelected ? 'text-primary' : ''}`}>
                                            {interest.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t">
                    <div className="max-w-md mx-auto flex gap-4">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleBack}
                            className="flex-1 h-14 text-lg"
                        >
                            <ChevronLeft className="mr-2 h-5 w-5" />
                            Wstecz
                        </Button>
                        <Button
                            size="lg"
                            onClick={handleNext}
                            className="flex-1 h-14 text-lg"
                        >
                            Rozpocznij
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Intro steps
    const step = steps[currentStep];

    return (
        <div className={`min-h-screen bg-gradient-to-br ${step.color} flex flex-col text-white`}>
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
                <div className="flex gap-2">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                                    ? 'w-8 bg-white'
                                    : index < currentStep
                                        ? 'w-2 bg-white/80'
                                        : 'w-2 bg-white/40'
                                }`}
                        />
                    ))}
                </div>
                <Button
                    variant="ghost"
                    onClick={handleSkip}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                >
                    Pomiń
                </Button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-32">
                <div className="mb-8 p-6 bg-white/20 rounded-full backdrop-blur-sm">
                    {step.icon}
                </div>
                <h1 className="text-4xl font-bold text-center mb-6 leading-tight">
                    {step.title}
                </h1>
                <p className="text-xl text-center text-white/90 max-w-sm leading-relaxed">
                    {step.description}
                </p>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/20 to-transparent">
                <div className="max-w-md mx-auto flex gap-4">
                    {currentStep > 0 && (
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleBack}
                            className="flex-1 h-14 text-lg bg-white/10 border-white/30 text-white hover:bg-white/20"
                        >
                            <ChevronLeft className="mr-2 h-5 w-5" />
                            Wstecz
                        </Button>
                    )}
                    <Button
                        size="lg"
                        onClick={handleNext}
                        className={`h-14 text-lg bg-white text-gray-900 hover:bg-white/90 ${currentStep === 0 ? 'w-full' : 'flex-1'}`}
                    >
                        Dalej
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
