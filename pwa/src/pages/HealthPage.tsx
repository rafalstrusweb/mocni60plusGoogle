import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';

export function HealthPage() {
    return (
        <MainLayout>
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-primary">Mocni w Formie</h1>
                <p className="text-muted-foreground text-lg">Twoje zdrowie i zakupy.</p>
            </div>

            <div className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-xl mt-8">
                <p>Ten moduł jest w trakcie budowy.</p>
                <Button className="mt-4" onClick={() => window.history.back()}>Wróć</Button>
            </div>
        </MainLayout>
    );
}
